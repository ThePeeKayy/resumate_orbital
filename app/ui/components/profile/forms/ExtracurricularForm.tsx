'use client'

import React, { useState } from 'react';
import { Extracurricular } from '../../../../types';
import { v4 as uuidv4 } from 'uuid';

interface ExtracurricularFormProps {
    extracurriculars: Extracurricular[];
    onAdd: (extracurricular: Extracurricular) => void;
    onUpdate: (index: number, extracurricular: Extracurricular) => void;
    onRemove: (index: number) => void;
}

export default function ExtracurricularForm({
    extracurriculars,
    onAdd,
    onUpdate,
    onRemove,
}: ExtracurricularFormProps) {
    const [formData, setFormData] = useState<Extracurricular>({
        id: '',
        name: '',
        role: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editIndex !== null) {
            onUpdate(editIndex, { ...extracurriculars[editIndex], ...formData });
            setEditIndex(null);
        } else {
            onAdd({ ...formData, id: uuidv4() });
        }

        // Reset form
        setFormData({
            id: '',
            name: '',
            role: '',
            description: '',
            startDate: '',
            endDate: '',
        });
    };

    const handleEdit = (index: number) => {
        setFormData(extracurriculars[index]);
        setEditIndex(index);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-600 shadow rounded-lg divide-y divide-gray-600">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Extracurricular Activities</h3>
                    <p className="mt-1 text-sm text-gray-400">Add your extracurricular activities, volunteer work, or leadership roles.</p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Organization/Activity Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                                    Your Role
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="role"
                                        id="role"
                                        value={formData.role || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
                                        placeholder="E.g., Volunteer, Club President, Team Captain"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                    Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
                                        placeholder="Briefly describe your involvement and any achievements"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                                    Start Date
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="date"
                                        name="startDate"
                                        id="startDate"
                                        value={formData.startDate || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                                    End Date (or leave empty if current)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="date"
                                        name="endDate"
                                        id="endDate"
                                        value={formData.endDate || ''}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        id: '',
                                        name: '',
                                        role: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                    });
                                    setEditIndex(null);
                                }}
                                className="bg-gray-700 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {editIndex !== null ? 'Update' : 'Add'} Activity
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {extracurriculars.length > 0 && (
                <div className="bg-gray-800 border border-gray-600 shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-600">
                        {extracurriculars.map((extracurricular, index) => (
                            <li key={extracurricular.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-blue-400 truncate">
                                                    {extracurricular.name}
                                                </p>
                                                {extracurricular.role && (
                                                    <p className="ml-2 text-sm text-gray-400">
                                                        {extracurricular.role}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-300">
                                                {extracurricular.description}
                                            </p>
                                            {(extracurricular.startDate || extracurricular.endDate) && (
                                                <p className="mt-2 text-xs text-gray-400">
                                                    {extracurricular.startDate && new Date(extracurricular.startDate).toLocaleDateString()}
                                                    {extracurricular.startDate && extracurricular.endDate && ' - '}
                                                    {extracurricular.endDate ? new Date(extracurricular.endDate).toLocaleDateString() : 'Present'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(index)}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onRemove(index)}
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-300 bg-red-900/20 hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}