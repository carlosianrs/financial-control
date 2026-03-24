import { NavLink } from "./nav-link";
import { Button } from "./ui/button";

export default function Tabs() {
  return (
    <nav className="mx-auto flex max-w-300 items-center gap-2">
      <Button asChild variant={'ghost'} size={'lg'} className="border border-transparent text-muted-foreground data-current-true:text-foreground">
        <NavLink href={'/'}>
          Dashboard
        </NavLink>
      </Button>
      <Button asChild variant={'ghost'} size={'lg'} className="border border-transparent text-muted-foreground data-current-true:text-foreground">
        <NavLink href={'/'}>
          Planejamento
        </NavLink>
      </Button>
      <Button asChild variant={'ghost'} size={'lg'} className="border border-transparent text-muted-foreground data-current-true:text-foreground">
        <NavLink href={'/'}>
          Pagamentos
        </NavLink>
      </Button>
      <Button asChild variant={'ghost'} size={'lg'} className="border border-transparent text-muted-foreground data-current-true:text-foreground">
        <NavLink href={'/'}>
          Categorias
        </NavLink>
      </Button>
    </nav>
  )
}