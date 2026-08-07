import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route element={<ProtectedRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
