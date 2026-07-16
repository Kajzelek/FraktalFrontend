import { Link } from 'react-router-dom'

export type AdminBreadcrumbItem = {
  label: string
  to?: string
}

type AdminBreadcrumbsProps = {
  items: AdminBreadcrumbItem[]
}

export function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav className="admin-breadcrumbs" aria-label="Sciezka admina">
      {items.map((item, index) => (
        <span className="breadcrumb-item" key={`${item.label}-${index}`}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
