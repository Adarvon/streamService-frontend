import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertCircle } from 'lucide-react';
import styles from './Auth.module.css';

export const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({ username, email, password });
      navigate('/');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.logo}>SoundWave</h1>
          <h2 className={styles.title}>Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
            />
            {validationErrors.username && (
              <div className={styles.fieldError}>
                <AlertCircle size={16} />
                {validationErrors.username}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            {validationErrors.email && (
              <div className={styles.fieldError}>
                <AlertCircle size={16} />
                {validationErrors.email}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {validationErrors.password && (
              <div className={styles.fieldError}>
                <AlertCircle size={16} />
                {validationErrors.password}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            {validationErrors.confirmPassword && (
              <div className={styles.fieldError}>
                <AlertCircle size={16} />
                {validationErrors.confirmPassword}
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
