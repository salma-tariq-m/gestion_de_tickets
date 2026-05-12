import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { User, Mail, Lock, Zap } from 'lucide-react';
import { useRegisterMutation } from './authApi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    toast.promise(registerUser(data).unwrap(), {
      loading: 'Création du compte…',
      success: () => { navigate('/dashboard'); return 'Compte créé avec succès !'; },
      error: (err) => err?.data?.message || t('common.error'),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900">TicketFlow</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.registerTitle')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input id="name" label={t('auth.name')} placeholder="Jean Dupont"
              leftIcon={<User size={15} />} error={errors.name?.message} {...register('name')} />
            <Input id="email" type="email" label={t('auth.email')} placeholder="vous@exemple.com"
              autoComplete="email" leftIcon={<Mail size={15} />} error={errors.email?.message} {...register('email')} />
            <Input id="password" type="password" label={t('auth.password')} placeholder="••••••••"
              autoComplete="new-password" leftIcon={<Lock size={15} />} error={errors.password?.message} {...register('password')} />
            <Input id="password_confirmation" type="password" label={t('auth.confirmPassword')} placeholder="••••••••"
              autoComplete="new-password" leftIcon={<Lock size={15} />} error={errors.password_confirmation?.message} {...register('password_confirmation')} />

            <Button type="submit" isLoading={isLoading} size="lg" className="mt-2 w-full">
              {t('auth.register')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('auth.alreadyAccount')}{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
