import { LogoMark } from "@/components/layout/Logo";

// The Collective's logo in the admin, in place of Payload's. Sized in app/(payload)/custom.scss:
// the admin doesn't load the site's Tailwind. Drawn in the text colour, so it suits both themes.

/** On the login page. */
export const AdminLogo = () => <LogoMark className="admin-logo" />;

/** In the nav. */
export const AdminIcon = () => <LogoMark variant="icon" className="admin-icon" />;
