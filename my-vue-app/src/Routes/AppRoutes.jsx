import React from 'react'
import { Route, Routes } from 'react-router'
import Layout from '../Layout/Layout'


const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route index element={<Layout />} />
                <Route path='/app' element={<Layout />}>
                     {/* <Route index element={<All />} /> */}
                    {/* <Route index element={<Active />} />
                    <Route index element={<Done />} /> */}
                </Route>

            </Routes>
        </>
    )
}

export default AppRoutes
