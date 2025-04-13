import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default function Header() {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-2 pl-6 py-6">
            <Link href="/operator/scanner" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              Go to Scanner
            </Link>
            <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
              <LogoutButton></LogoutButton>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
     
      <nav className="ml-auto hidden lg:flex gap-6">
        <Link
          href="/operator/scanner"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          prefetch={false}
        >
          Go to Scanner
        </Link>
        
        <Link
          href="#"
          className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          prefetch={false}
        >
          <LogoutButton></LogoutButton>
        </Link>
      </nav>
    </header>
  )
}

// @ts-expect-error : props can be anything
function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


// function MountainIcon(props:any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   )
// }