'use client';

import {useState, useEffect} from 'react';
import {OrganizationProfile} from '@clerk/nextjs';
import {Modal, ModalHeader} from '@colonial-collections/ui/modal';

/**
 * CLERK V6 WORKAROUND: Hash-Aware Organization Profile Modal
 *
 * Goal: Display Clerk's OrganizationProfile component in a modal, showing either
 * the members tab or settings tab based on user action (not both at once).
 *
 * Problem: Clerk v6's OrganizationProfile doesn't reliably show specific tabs when opened via API.
 * The openOrganizationProfile() modal API doesn't support targeting specific pages consistently.
 *
 * Solution: Use a custom modal with hash routing and component re-mounting.
 * - Hash routing tells Clerk which tab to show ('#/organization-members', '#' for general settings)
 * - Key prop forces re-render when hash changes (needed for tab switching)
 * - Manual hash management ensures correct tab loads on first open
 * - Custom styling hides Clerk's tab navigation to show only specific content
 *
 * Usage:
 * 1. Call openProfile('members') or openProfile('settings') from useCommunityProfile hook
 * 2. Hook sets hash synchronously, then opens this modal
 * 3. Modal reads hash and shows correct tab immediately
 * 4. Hash changes while open will switch tabs automatically
 */

interface CommunityProfileModalProps {
  modalId?: string;
}

export default function CommunityProfileModal({
  modalId = 'community-profile-modal',
}: CommunityProfileModalProps) {
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    // Set initial state from current hash
    const initialHash = window.location.hash;
    setCurrentHash(initialHash);

    // Listen for hash changes to switch tabs while modal is open
    const handleHashChange = () => {
      const newHash = window.location.hash;
      setCurrentHash(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <Modal id={modalId} variant="auto">
      <ModalHeader />
      <div className="mt-4">
        {/*
          Key prop is CRITICAL: Forces OrganizationProfile to re-mount when hash changes.
          Without this, Clerk component won't switch tabs after initial render.
        */}
        <OrganizationProfile
          key={currentHash}
          routing="hash"
          appearance={{
            variables: {
              colorShadow: 'transparent',
              colorBorder: 'transparent',
            },
            elements: {
              // Hide Clerk's navigation to show only the specific tab content
              navbar: 'hidden',
              navbarMobileMenuRow: 'hidden',
              // Remove card styling to blend with our modal
              cardBox:
                'grid-cols-1 shadow-none border-0 ring-0 bg-transparent p-0',
              card: 'shadow-none border-0 ring-0 bg-transparent p-0',
              rootBox: 'bg-transparent p-0 w-full',
              pageScrollBox: '!pl-0',
            },
          }}
        />
      </div>
    </Modal>
  );
}
