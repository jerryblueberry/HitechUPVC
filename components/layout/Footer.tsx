import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { telHref } from "@/lib/constants";
import type { Company, Navigation } from "@/lib/types";

interface FooterProps {
  navigation: Navigation;
  company: Company;
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
                className="hover:text-gold capitalize"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
