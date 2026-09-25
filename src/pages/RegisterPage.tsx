import { useState } from "react";
import type { SubmitEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { RegisterPanel } from "../components/RegisterPanel";
import type { RegisterForm } from "../types/auth";

export function RegisterPage() {
    const { isAuthenticated, loading, register } = useAuth()
    const navigate = useNavigate()
    const [validationError, setValidationError] = useState('')
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    if (isAuthenticated) {
        return <Navigate to="/courses" replace />
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setValidationError('')
        if (
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setValidationError('Uzupelnij wszystkie pola.')
            return
        }

        if (form.password.length < 6) {
            setValidationError('Haslo musi miec co najmniej 6 znakow.')
            return
        }

        if (form.password !== form.confirmPassword) {
            setValidationError('Hasla nie sa identyczne.')
            return
        }

        try {
            await register(form)
            navigate('/courses', { replace: true })
        } catch {

        }
    }

    return (
        <RegisterPanel
            form={form}
            loading={loading}
            validationError={validationError}
            onFormChange={setForm}
            onSubmit={(event) => void handleSubmit(event)}
        />
    )
}