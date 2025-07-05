import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

function layout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default layout
