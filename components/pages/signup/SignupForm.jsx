"use client";
import React from 'react';
import { Input } from '@/components/local-ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import Link from 'next/link';
import { AuthenticateWith } from '@/components/local-ui/authenticateWith';
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SuccessMessage } from "@/components/local-ui/successMessage";
import { signUpAction } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import routes from '@/data/routes.json';
export function SignupForm() {
  const router = useRouter();
  const [state, dispatch] = useFormState(signUpAction, undefined);

  useEffect(() => {
    if (state?.success === true && state?.error === undefined) {
      setTimeout(() => {
        router.push(`${routes.login.path}?signedUp=true`);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="bg-white p-7 rounded-lg shadow-lg">
      <div
        className={
          "mb-4"
        }
        aria-live="polite"
        aria-atomic="true"
      >
        { state?.success === false && state?.message && (
          <ErrorMessage message={ state?.message } />) }
        { state?.success === true && state?.message && (
          <SuccessMessage message={ state?.message } />
        ) }
      </div>
      <form id="signup-form" action={ dispatch } className="space-y-4">
        <input type="hidden" name={ 'action' } value={ 'signup' } />
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            placeholder={ "Enter your first name" }
            name={ "firstname" }
            label={ "First Name" }
            error={ state?.error?.firstname }
            required
            className={ "max-sm:col-span-2" }
          />
          <Input
            placeholder={ "Enter your last name" }
            name={ "lastname" }
            label={ "Last Name" }
            error={ state?.error?.lastname }
            required
            className={ "max-sm:col-span-2" }
          />
          <Input
            type="email"
            placeholder={ "Enter your email address" }
            name={ "email" }
            label={ "Email" }
            error={ state?.error?.email }
            required
            className="max-sm:col-span-2 md:col-span-2 sm:col-span-1 lg:col-span-1"
          />
          <Input
            type="tel"
            placeholder={ "Enter your phone number (optional)" }
            name={ "phone" }
            label={ "Phone (optional)" }
            error={ state?.error?.phone }
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
            error={ state?.error?.password }
            className={ "col-span-2" }
            required
          />
          <Input
            type="password"
            placeholder={ "Enter same password again" }
            name={ "confirmPassword" }
            label={ "Confirm Password" }
            error={ state?.error?.confirmPassword }
            className={ "col-span-2" }
            required
          />
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <Checkbox
            id={ "acceptTerms" }
            name={ "acceptTerms" }
            error={ state?.error?.acceptTerms }
            label={
              <span className={ `text-xs text-secondary select-none` }>
                I agree to all the{ " " }
                <Link href={ routes["terms-of-service"].path } target="_blank" className="text-tertiary select-text">
                  { routes["terms-of-service"].title }
                </Link>{ " " }
                and{ " " }
                <Link
                  href={ routes["privacy-policy"].path }
                  target="_blank"
                  className="text-tertiary select-text"
                >
                  { routes["privacy-policy"].title }
                </Link>
              </span>
            }
          />
        </div>
        <SubmitBtn formId="signup-form" className="!mt-[24px] w-full" customTitle={ {
          default: "Create Account",
          onSubmitting: "Creating account...",
        } }
        />
      </form>
      <div className="mt-[16px] text-center text-[0.875rem] font-medium text-secondary">
        Already have an account?{ " " }
        <Link href={ routes.login.path } className="text-tertiary">
          { routes.login.title }
        </Link>
      </div>
      <AuthenticateWith message={ "Or signup with" } />
    </div>
  );
}
