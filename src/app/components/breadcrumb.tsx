import React from 'react';
import Link from 'next/link';
import { BsHouse, BsChevronRight } from 'react-icons/bs';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <div className="container">
        <div className="d-flex align-items-center py-2">
          <Link href="/" className="text-muted d-flex align-items-center text-decoration-none">
            <BsHouse className="me-1" size={14} />
            <span className="small">Home</span>
          </Link>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BsChevronRight className="mx-2 text-muted" size={10} />
              {item.href && !item.active ? (
                <Link href={item.href} className="text-muted text-decoration-none">
                  <span className="small">{item.label}</span>
                </Link>
              ) : (
                <span className={`small ${item.active ? 'text-dark fw-medium' : 'text-muted'}`}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}