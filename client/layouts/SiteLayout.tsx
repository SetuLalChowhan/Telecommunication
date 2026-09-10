import Footer from '@/shared/Footer'
import Header from '@/shared/Header'
import React from 'react'

interface SiteLayoutProps {
    children: React.ReactNode
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default SiteLayout