import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { telHref } from "@/lib/constants";
import type { Company, Navigation } from "@/lib/types";

interface FooterProps {
  navigation: Navigation;
  company: Company;
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      aria-hidden
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform.toLowerCase() === "instagram") return <InstagramIcon />;
  return null;
}

export function Footer({ navigation, company }: FooterProps) {
  return (
    <footer className="bg-navy text-surface section-padding">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <p className="mb-4">
              <BrandLogo
                name={company.companyName}
                src={company.logo}
                className="text-2xl"
                subClassName="text-surface/60"
              />
            </p>
            <p className="text-surface/70 text-sm leading-relaxed">
              {company.tagline}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold">Navigation</p>
            <ul className="space-y-2">
              {navigation.footer.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-surface/70 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold">Contact</p>
            <ul className="space-y-2 text-sm text-surface/70">
              {company.contact.phones.map((phone) => (
                <li key={phone}>
                  <a href={telHref(phone)} className="hover:text-gold">
                    {phone}
                  </a>
                </li>
              ))}
              {company.contact.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="hover:text-gold break-all">
                    {email}
                  </a>
                </li>
              ))}
              {company.contact.addresses.map((addr) => (
                <li key={addr.label}>
                  <a
                    href={addr.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold"
                  >
                    {addr.label} — {addr.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4 text-gold">Certifications</p>
            <ul className="flex flex-wrap gap-2">
              {company.certifications.map((cert) => (
                <li
                  key={cert}
                  className="text-xs px-3 py-1 rounded-full border border-surface/20 text-surface/80"
                >
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-surface/50">
          <p>© {new Date().getFullYear()} {company.companyName}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              aria-hidden
              className="text-gold"
            >
              <path
                fill="currentColor"
                d="M12 21s-6.7-4.35-9.33-8.22C.8 10.1 1.2 6.7 4.05 5.2c1.8-.94 4.05-.5 5.4 1.05L12 8.9l2.55-2.65c1.35-1.55 3.6-1.99 5.4-1.05 2.85 1.5 3.25 4.9 1.38 7.58C18.7 16.65 12 21 12 21Z"
              />
            </svg>
            in Nepal
          </p>
          <div className="flex gap-4">
            {company.social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-gold capitalize"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={s.platform} />
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
