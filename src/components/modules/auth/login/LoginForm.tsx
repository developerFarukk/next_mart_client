

"use client";

import { useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Logo from "@/app/assets/svgs/Logo";
import { loginUser, reCaptchaTokenVerification } from "@/services/AuthService";
import { toast } from "sonner";
import { loginSchema } from "./loginValidation";
import ReCAPTCHA from "react-google-recaptcha";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes } from "@/contants";

// Create a wrapped version of ReCAPTCHA that supports ref forwarding
const RecaptchaWithRef = dynamic(
    () => import('react-google-recaptcha').then((mod) => {
        const Recaptcha = mod.default;
        return forwardRef<ReCAPTCHA, React.ComponentProps<typeof Recaptcha>>(
            (props, ref) => <Recaptcha {...props} ref={ref} />
        );
    }),
    {
        ssr: false,
        loading: () => <div className="h-[78px] w-[300px] bg-gray-200 rounded animate-pulse"></div>,
    }
);

export default function LoginForm() {
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "mama@mamai.com",
            password: "12345678"
        }
    });

    const [reCaptchaStatus, setReCaptchaStatus] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const { formState: { isSubmitting }, reset } = form;
    const pathname = usePathname();
    const router = useRouter();

    const handleReCaptcha = async (value: string | null) => {
        try {
            const res = await reCaptchaTokenVerification(value!);
            if (res?.success) {
                setReCaptchaStatus(true);
            }
        } catch (err: any) {
            console.error(err);
            setReCaptchaStatus(false);
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            if (!reCaptchaStatus) {
                toast.error("Please verify you're not a robot");
                return;
            }

            const res = await loginUser(data);
            if (res?.success) {
                toast.success(res?.message);
                if (protectedRoutes.some((route: any) => pathname.match(route))) {
                    router.push("/");
                }
                reset();
                recaptchaRef.current?.reset();
                setReCaptchaStatus(false);
            } else {
                toast.error(res?.message);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "An error occurred during login");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            className="border border-gray-200 shadow-sm rounded-xl flex-grow max-w-md w-full p-6 bg-white"
        >
            <div className="flex items-center space-x-4 mb-6">
                <Logo />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Login</h1>
                    <p className="font-light text-sm text-gray-600">Welcome back! Please enter your details</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...field}
                                        className="focus-visible:ring-primary"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...field}
                                        className="focus-visible:ring-primary"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center pt-2">
                        <RecaptchaWithRef
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY!}
                            onChange={handleReCaptcha}
                        />
                    </div>

                    <Button
                        disabled={!reCaptchaStatus || isSubmitting}
                        type="submit"
                        className="w-full mt-4 bg-primary hover:bg-primary-dark transition-colors"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>

            <p className="text-sm text-gray-600 text-center mt-6">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="text-primary font-medium hover:underline"
                >
                    Register
                </Link>
            </p>
        </motion.div>
    );
}