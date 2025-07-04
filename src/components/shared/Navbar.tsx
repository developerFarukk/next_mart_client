"use client"

import Logo from "@/assets/svgs/Logo";
import { Button } from "../ui/button";
import { Heart, LogOut, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes } from "@/contants";
import { logout } from "@/services/AuthService";

export default function Navbar() {

    const { user, setIsLoading } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    // const products = useAppSelector(orderedProductsSelector);

    const handleLogOut = () => {
        logout();
        setIsLoading(true);
        if (protectedRoutes.some((route: any) => pathname.match(route))) {
            router.push("/");
        }
    };

    return (
        <header className="border-b bg-background w-full sticky top-0 z-10">
            <div className="container flex justify-between items-center mx-auto h-16 px-5">
                <Link href="/">
                    <h1 className="text-2xl font-black flex items-center">
                        <Logo /> Next Mart
                    </h1>
                </Link>
                <div className="max-w-md  flex-grow">
                    <input
                        type="text"
                        placeholder="Search for products"
                        className="w-full max-w-6xl border border-gray-300 rounded-full py-2 px-5"
                    />
                </div>
                <nav className="flex gap-2">
                    <Button variant="outline" className="rounded-full p-0 size-10">
                        <Heart />
                    </Button>
                    <Link href="/cart" passHref>
                        <Button
                            variant="outline"
                            className="rounded-full size-10 flex items-center justify-center gap-1"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="text-red-500 font-bold">
                                {/* {products?.length ?? 0} */}
                                0
                            </span>
                        </Button>
                    </Link>

                    {user?.email ? (
                        <>
                            <Link href="/create-shop">
                                <Button className="rounded-full">Create Shop</Button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>User</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>My Shop</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="bg-red-500 cursor-pointer"
                                        onClick={handleLogOut}
                                    >
                                        <LogOut />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button className="rounded-full" variant="outline">
                                Login
                            </Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
