import DashboardLayout from '@/layouts/DashboardLayout'
import React from 'react'

interface Props {
    children: React.ReactNode
}

const layout = ({ children }: Props) => {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}

export default layout
