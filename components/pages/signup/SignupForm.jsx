"use client";
import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SignupBtn } from '@/components/pages/signup/signup-button';
import Link from 'next/link';
import { AlertCircle, UserRoundPlus } from 'lucide-react';
import { AuthenticateWith } from '@/components/local-ui/authenticateWith';
import { signUpAction } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SignupForm() {
  const router = useRouter();
  const [state, dispatch] = useFormState(signUpAction, undefined);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (state?.success === false && state?.error !== undefined) {
      setErrors(state.error);
    }

    if (state?.success === true && state?.error === undefined) {
      setTimeout(() => {
        router.push('/login?s=true');
      }, 1000);
    }
  }, [state]);

  if (state?.success === false && state?.error !== undefined) {
    for (let key in state?.message) {
      errors[state?.message[key].path[0]] = state?.message[key].message;
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div
        className={ cn(
          "flex text-destructive-foreground text-sm rounded-lg p-3 h-[48px] mb-5 items-center bg-transparent space-x-1",
          state?.error === "signup_error" && "bg-destructive",
          state?.success && "bg-primary/80 text-black"
        ) }
        aria-live="polite"
        aria-atomic="true"
      >
        { state?.error === "signup_error" && (
          <>
            <AlertCircle className="h-5 w-5" />
            <p>{ state?.message }</p>
          </>
        ) }
        { state?.success === true && (
          <>
            <UserRoundPlus className="h-5 w-5" />
            <p>{ state?.message }</p>
          </>
        ) }
      </div>
      <form action={ dispatch } className="space-y-4">
        <input type="hidden" name={ 'action' } value={ 'signup' } />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder={ "Enter your first name" }
            name={ "firstname" }
            label={ "First Name" }
            error={ errors?.firstname }
            required
            className={ "max-xsm:col-span-2" }
          />
          <Input
            placeholder={ "Enter your last name" }
            name={ "lastname" }
            label={ "Last Name" }
            error={ errors?.lastname }
            required
            className={ "max-xsm:col-span-2" }
          />
          <Input
            type="email"
            placeholder={ "Enter your email address" }
            name={ "email" }
            label={ "Email" }
            error={ errors?.email }
            required
            className="max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1"
          />
          <Input
            type="tel"
            placeholder={ "Enter your phone number (optional)" }
            name={ "phone" }
            label={ "Phone (optional)" }
            error={ errors?.phone }
            maxLength={ 15 }
            className={
              "max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1 "
            }
          />
          <Input
            type="password"
            placeholder={ "Enter your password" }
            name={ "password" }
            label={ "Password" }
            error={ errors?.password }
            className={ "col-span-2" }
            required
          />
          <Input
            type="password"
            placeholder={ "Enter same password again" }
            name={ "confirmPassword" }
            label={ "Confirm Password" }
            error={ errors?.confirmPassword }
            className={ "col-span-2" }
            required
          />
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <Checkbox
            id={ "acceptTerms" }
            name={ "acceptTerms" }
            error={ errors?.acceptTerms }
            label={
              <span className={ `text-[0.875rem] font-medium text-secondary` }>
                I agree to all the{ " " }
                <Link href={ "/terms" } target="_blank" className="text-tertiary">
                  Terms
                </Link>{ " " }
                and{ " " }
                <Link
                  href={ "/privacy-policy" }
                  target="_blank"
                  className="text-tertiary"
                >
                  Privacy Policies
                </Link>
              </span>
            }
          />
        </div>
        <SignupBtn />
      </form>
      <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
        Already have an account?{ " " }
        <Link href={ "/login" } className="text-tertiary">
          Login
        </Link>
      </div>
      <AuthenticateWith message={ "Or signup with" } />
    </>
  );
}
