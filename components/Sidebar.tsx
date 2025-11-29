'use client'

import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:translate-x-0 md:static md:z-auto md:shadow-none
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden mb-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Why trust this tool */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Why trust this tool?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                This tool provides suggestions grounded in evidence-based teaching
                research.
              </p>
              <p>
                All recommendations are based on proven pedagogical principles that
                have been validated through educational research.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
                onClick={(e) => {
                  e.preventDefault()
                  // Placeholder for "About the research" page
                  alert('About the research page - to be implemented')
                }}
              >
                Learn more about the research
              </a>
            </div>
          </section>

          {/* Need more support */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Need more support?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Try suggestions small-scale first, then scale up with expert help.
              </p>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => {
                    e.preventDefault()
                    // Placeholder for consultation scheduling
                    alert('Schedule consultation - to be implemented')
                  }}
                >
                  Schedule teaching center consultation
                </a>
                <a
                  href="#"
                  className="block text-blue-600 hover:text-blue-800 underline"
                  onClick={(e) => {
                    e.preventDefault()
                    // Placeholder for workshops
                    alert('Workshops and fellowships - to be implemented')
                  }}
                >
                  Workshops & fellowships for deeper learning
                </a>
              </div>
            </div>
          </section>

          {/* Quick tips */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Tips
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Focus on one problem at a time</li>
              <li>Start with small changes</li>
              <li>Reducing chaos helps both you and students</li>
            </ul>
          </section>
        </div>
      </aside>
    </>
  )
}

