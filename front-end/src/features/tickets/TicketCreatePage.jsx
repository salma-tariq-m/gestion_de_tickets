import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft, Paperclip } from 'lucide-react';
import { useCreateTicketMutation } from './ticketsApi';
import { useGetCategoriesQuery } from '../admin/adminApi';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { RichEditor } from '../../components/ui/RichEditor';
import { PRIORITY, PRIORITY_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const schema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(1, 'La description est obligatoire'),
  category_id: z.string().min(1, 'La catégorie est obligatoire'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'La priorité est obligatoire' }),
});

export default function TicketCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const priority = watch('priority');

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category_id', data.category_id);
    formData.append('priority', data.priority);

    // Attachments
    if (data.attachments) {
      Array.from(data.attachments).forEach((file) => formData.append('attachments[]', file));
    }

    toast.promise(createTicket(formData).unwrap(), {
      loading: 'Création du ticket…',
      success: (ticket) => {
        navigate(`/tickets/${ticket.ticket?.id || ''}`);
        return t('tickets.createSuccess');
      },
      error: (err) => err?.data?.message || t('common.error'),
    });
  };

  const priorities = Object.values(PRIORITY);
  const priorityColors = { low: 'border-emerald-400 bg-emerald-50 text-emerald-700', medium: 'border-amber-400 bg-amber-50 text-amber-700', high: 'border-red-400 bg-red-50 text-red-700' };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Back */}
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Retour aux tickets
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('tickets.new')}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate encType="multipart/form-data">
          {/* Title */}
          <Input
            id="ticket-title"
            label={t('tickets.titleField')}
            placeholder="Décrivez le problème en quelques mots…"
            error={errors.title?.message}
            {...register('title')}
          />

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="ticket-category"
              label={t('tickets.category')}
              options={categoryOptions}
              placeholder="Sélectionner…"
              error={errors.category_id?.message}
              {...register('category_id')}
            />

            {/* Priority radio group */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">{t('tickets.priority')}</span>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setValue('priority', p, { shouldValidate: true })}
                    className={cn(
                      'flex-1 py-2 rounded-lg border-2 text-xs font-semibold transition-all duration-150',
                      priority === p ? priorityColors[p] : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    {PRIORITY_LABELS[p]}
                  </button>
                ))}
              </div>
              {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Description — TipTap */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichEditor
                label={t('tickets.description')}
                value={field.value}
                onChange={field.onChange}
                placeholder="Décrivez votre problème en détail…"
                error={errors.description?.message}
              />
            )}
          />

          {/* Attachments */}
          <div className="flex flex-col gap-1">
            <label htmlFor="ticket-attachments" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Paperclip size={14} className="text-gray-400" />
              {t('tickets.attachments')} <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              id="ticket-attachments"
              type="file"
              multiple
              accept="image/*,.pdf,.txt"
              className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
              {...register('attachments')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => navigate('/tickets')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {t('common.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
