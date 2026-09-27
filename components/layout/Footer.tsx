import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
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
              <li>
                <a href={`tel:${company.contact.phone}`} className="hover:text-gold">
                  {company.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.contact.email}`} className="hover:text-gold">
                  {company.contact.email}
                </a>
              </li>
              {company.contact.addresses.map((addr) => (
                <li key={addr.label}>{addr.address}</li>
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

        <div className="mt-12 pt-8 border-t border-surface/10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-surface/50">
          <p>© {new Date().getFullYear()} {company.companyName}. All rights reserved.</p>
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
