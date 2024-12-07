import { Link, useNavigate } from 'react-router-dom';
import css from './SignUp.module.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '../Icon/Icon.jsx';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Logo from '../../components/Logo/Logo.jsx';
import { fetchSignUp } from '../../redux/auth/operations.js';
import { useTranslation } from 'react-i18next';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Enter a real password!')
    .max(50, 'Too long')
    .required('Password is required'),
  repeatPassword: Yup.string()
    .min(8, 'Enter a real password!')
    .max(50, 'Too long')
    .oneOf([Yup.ref('password'), null], 'Passwords must match!')
    .required('Password is required'),
});

function SignUpForm() {
  const { t } = useTranslation();
  const [showPwd, setShowPwd] = useState(false);
  const [showRepeatPwd, setShowRepeatPwd] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePwdVisibility = () => setShowPwd((prev) => !prev);
  const toggleRepeatPwdVisibility = () => setShowRepeatPwd((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {

    const { email, password } = data;
    try {
      const result = await dispatch(fetchSignUp({ email, password })).unwrap();

      reset();
      navigate('/tracker');
    } catch (error) {
      const errorMessage =
        error?.message || 'Failed to sign up. Please try again.';

      setNotification({
        message:
          error?.response?.data?.message ||
          'Registration failed. Please try again.',
        type: 'error',
      });

      setTimeout(() => setNotification(null), 8000);

      setNotification(errorMessage);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className={css.containerUp}>
      <Logo />
      <div className={css.formUp}>
        <h2 className={css.titleUp}>{t('signUp.title')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="email" className={css.labelUp}>
              {t('signUp.email')}
            </label>
            <input
              {...register('email')}
              type="email"
              name="email"
              placeholder={t('signUp.placeholderEmail')}
              className={`${css.inputUp} ${errors.email ? css.inputError : ''}`}
            />
          </div>
          {errors.email && (
            <p className={css.errorText}>{errors.email.message}</p>
          )}

          <div>
            <label htmlFor="password" className={css.labelUp}>
              {t('signUp.password')}
            </label>
            <div className={css.inputWrapper}>
              <input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder={t('signUp.placeholderPassword')}
                className={`${css.inputUp} ${
                  errors.password ? css.inputError : ''
                }  `}
              />

              <button
                className={css.iconButton}
                type="button"
                onClick={togglePwdVisibility}
                aria-label={
                  showRepeatPwd
                    ? 'Hide repeat password'
                    : 'Show repeat password'
                }
              >
                <Icon
                  className={css.icon}
                  id={showPwd ? 'icon-eye' : 'icon-eye-off'}
                  size={24}
                />
              </button>
            </div>
            {errors.password && (
              <p className={css.errorText}>{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className={css.labelUp}>
              {t('signUp.placeholderRepeatPassword')}
            </label>
            <div className={css.inputWrapper}>
              <input
                {...register('repeatPassword')}
                type={showRepeatPwd ? 'text' : 'password'}
                name="repeatPassword"
                placeholder={t('signUp.placeholderRepeatPassword')}
                className={`${css.inputUp} ${
                  errors.repeatPassword ? css.inputError : ''
                }`}
              />

              <button
                className={css.iconButton}
                type="button"
                onClick={toggleRepeatPwdVisibility}
                aria-label={
                  showRepeatPwd
                    ? 'Hide repeat password'
                    : 'Show repeat password'
                }
              >
                <Icon
                  className={css.icon}
                  id={showRepeatPwd ? 'icon-eye' : 'icon-eye-off'}
                  size={24}
                />
              </button>
            </div>
            {errors.repeatPassword && (
              <p className={css.errorText}>{errors.repeatPassword.message}</p>
            )}
          </div>

          <button type="submit" className={css.btnUp}>
            {t('signIn.signUp')}
          </button>
        </form>
        {notification && <div className={css.notification}>{notification}</div>}
        <div>
          <p className={css.textUp}>
            {t('signUp.account')}{' '}
            <Link to="/signin" className={css.linkUp}>
              {t('signUp.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;