import type { SubmitEvent } from 'react';
import type { RegisterForm } from '../types/auth';
import { Link } from 'react-router-dom';

type RegisterPanelProps = {
    form: RegisterForm
    loading: boolean
    validationError: string
    onFormChange: (form: RegisterForm) => void
    onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

export function RegisterPanel({
    form,
    loading,
    validationError,
    onFormChange,
    onSubmit,
}: RegisterPanelProps) {
    return (
        <section className="login-panel">
            <div>
                <p className="eyebrow">Rejestracja</p>
                <h2>Utwórz konto</h2>
            </div>

            {validationError && <div className="alert">{validationError}</div>}

            <form onSubmit={onSubmit}>
                <label>
                    Nazwa uzytkownika
                    <input
                        type="text"
                        value={form.username}
                        onChange={(event) =>
                            onFormChange({ ...form, username: event.target.value })
                        }
                        autoComplete="username"
                        required
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            onFormChange({ ...form, email: event.target.value })
                        }
                        autoComplete="email"
                        required
                    />
                </label>

                <label>
                    Haslo
                    <input
                        type="password"
                        value={form.password}
                        onChange={(event) =>
                            onFormChange({ ...form, password: event.target.value })
                        }
                        autoComplete="new-password"
                        required
                    />
                </label>

                <label>
                    Powtorz haslo
                    <input
                        type="password"
                        value={form.confirmPassword}
                        onChange={(event) =>
                            onFormChange({ ...form, confirmPassword: event.target.value })
                        }
                        autoComplete="new-password"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Tworzenie konta...' : 'Utworz konto'}
                </button>
            </form>
            <p className='auth-switch'>
                Masz juz konto? <Link to="/login">Zaloguj sie</Link>
            </p>
        </section>
    )
}