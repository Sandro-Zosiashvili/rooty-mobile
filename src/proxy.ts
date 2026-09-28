import {useEffect} from "react";
import {useRouter, useSegments} from "expo-router";
import {hasSession} from "@/auth/session";

/**
 * ვების src/proxy.ts იყო Next.js middleware — request-ს ჭრიდა და cookie-ებით
 * წყვეტდა redirect-ს. მობაილს middleware არ აქვს, ამიტომ იგივე ლოგიკა route-guard
 * hook-ად გადმოვიდა: აქტიურ route-ს ვადარებთ protected/auth სიებს და სესიის მიხედვით
 * ვახდენთ redirect-ს (expo-router-ით).
 */

const PROTECTED_ROUTES = ["dashboard", "onboarding"];
const AUTH_ROUTES = ["login", "register", "forgot-password"];

export function useProxy() {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            // მიმდინარე top-level route ((auth) group-ს გამოვტოვებთ)
            const current = segments.filter((s) => !s.startsWith("(")).at(0) ?? "";
            const authed = await hasSession();

            if (cancelled) return;

            if (PROTECTED_ROUTES.includes(current) && !authed) {
                router.replace("/login");
            } else if (AUTH_ROUTES.includes(current) && authed) {
                router.replace("/dashboard");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [segments, router]);
}
