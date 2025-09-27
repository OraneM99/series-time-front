import { PROVIDER_META } from '../../constants/provider-meta';

export function buildWatchLinks(links: any[] = []) {
  return links
    .filter(l => l?.enabled && l?.provider && l?.url)
    .map(l => {
      const key = String(l.provider).toLowerCase().replace(/[^a-z0-9]+/g, '');
      const meta = PROVIDER_META[key] || PROVIDER_META['generic'];
      return {
        key,
        label: meta.label,
        icon: meta.icon,
        url: l.url,
      };
    });
}
