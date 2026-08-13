"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { APIError } from "@/lib/api";
import { login, logout } from "@/app/auth/api";
import { setUser } from "@/app/auth/auth-slice";
import type { AppDispatch } from "@/app/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "用户名至少需要 3 个字符!")
    .max(32, "用户名不能超过 32 个字符!"),
  password: z
    .string()
    .min(10, "密码至少需要 10 个字符!")
    .max(128, "密码不能超过 128 个字符!"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onBlur: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const user = await login(value);

        if (user.role !== "ADMIN") {
          await logout().catch(() => undefined);
          setServerError("当前账号没有后台访问权限!");
          return;
        }

        dispatch(setUser(user));
        router.replace("/admin");
      } catch (error) {
        setServerError(
          error instanceof APIError
            ? error.message
            : "无法连接 API，请确认后端服务已启动!",
        );
      }
    },
  });

  return (
    <main className="flex min-h-screen">
      <div className="hidden flex-1 bg-black lg:block" />

      <div className="flex w-full items-center justify-center p-6 lg:w-100">
        <Card className="w-full">
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="username">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>用户名</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            setServerError(null);
                            field.handleChange(event.target.value);
                          }}
                          autoComplete="username"
                          minLength={3}
                          maxLength={32}
                          required
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            setServerError(null);
                            field.handleChange(event.target.value);
                          }}
                          autoComplete="current-password"
                          minLength={10}
                          maxLength={128}
                          required
                          aria-invalid={isInvalid}
                          aria-describedby={
                            isInvalid ? `${field.name}-error` : undefined
                          }
                        />
                        {isInvalid && (
                          <FieldError
                            id={`${field.name}-error`}
                            errors={field.state.meta.errors}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>

              {serverError && <FieldError>{serverError}</FieldError>}

              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting] as const
                }
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "登录中..." : "登录"}
                  </Button>
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
