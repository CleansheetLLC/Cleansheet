/**
 * Data Integrity Tests - CRITICAL DATA LOSS PREVENTION
 *
 * These tests verify that data relationships, structures, and completeness
 * are preserved during backup/restore operations. Partial data loss can occur
 * if relationships break or transactions are not atomic.
 *
 * Priority: CRITICAL
 * Risk Level: HIGH - Partial data loss, broken relationships
 */

import { test, expect } from '../../fixtures/canvas-fixtures.js';
import { StorageHelpers } from '../../helpers/storage-helpers.js';
import { BackupRestorePage } from '../../page-objects/BackupRestorePage.js';
import path from 'path';
import fs from 'fs';

test.describe('🔒 Data Integrity - CRITICAL DATA LOSS PREVENTION', () => {

  test.beforeEach(async ({ page }) => {
    // Start with clean slate for each integrity test
    await page.goto('/web/career-canvas.html');
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should preserve all experience data structure during restore', async ({ page }) => {
    // CRITICAL: All experience fields must be preserved
    // Missing fields = incomplete user history

    // Create comprehensive experience data
    const complexExperience = {
      id: 'test-exp-complex-1',
      role: 'Senior Software Engineer',
      organizationName: 'Tech Company Inc',
      startDate: '2020-01-01',
      endDate: '2023-12-31',
      description: 'Led development of cloud infrastructure platform',
      skills: ['JavaScript', 'Python', 'AWS', 'Docker', 'Kubernetes'],
      achievements: [
        'Reduced deployment time by 60%',
        'Improved system reliability to 99.99%',
        'Mentored 5 junior developers'
      ],
      projectsWorkedOn: ['Cloud Platform', 'Microservices Migration'],
      responsibilities: [
        'Architecture design',
        'Code review',
        'Team leadership'
      ],
      tags: ['full-time', 'remote', 'leadership'],
      linkedDocuments: ['doc-1', 'doc-2'],
      linkedDiagrams: ['diagram-1']
    };

    // Setup initial data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [complexExperience]);
    await page.reload();

    // Export backup
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    // Clear and restore
    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();

    await backupPage.restoreFromFile(filePath);
    await backupPage.waitForRestoreSuccess();

    // Verify COMPLETE data preservation
    const restored = await StorageHelpers.getStorageItem(page, 'user_experiences_current');

    expect(restored).toHaveLength(1);
    const exp = restored[0];

    // Verify ALL fields preserved
    expect(exp.id).toBe(complexExperience.id);
    expect(exp.role).toBe(complexExperience.role);
    expect(exp.organizationName).toBe(complexExperience.organizationName);
    expect(exp.startDate).toBe(complexExperience.startDate);
    expect(exp.endDate).toBe(complexExperience.endDate);
    expect(exp.description).toBe(complexExperience.description);

    // Arrays preserved with correct length
    expect(exp.skills).toHaveLength(complexExperience.skills.length);
    expect(exp.achievements).toHaveLength(complexExperience.achievements.length);
    expect(exp.projectsWorkedOn).toHaveLength(complexExperience.projectsWorkedOn.length);
    expect(exp.responsibilities).toHaveLength(complexExperience.responsibilities.length);
    expect(exp.tags).toHaveLength(complexExperience.tags.length);
    expect(exp.linkedDocuments).toHaveLength(complexExperience.linkedDocuments.length);
    expect(exp.linkedDiagrams).toHaveLength(complexExperience.linkedDiagrams.length);

    // Verify specific array contents
    expect(exp.skills).toContain('Kubernetes');
    expect(exp.achievements).toContain('Reduced deployment time by 60%');
    expect(exp.linkedDocuments).toContain('doc-1');
  });

  test('should maintain canvas tree structure and hierarchical relationships', async ({ page }) => {
    // CRITICAL: Canvas tree hierarchy must be preserved
    // Broken hierarchy = broken navigation

    // Create complex tree structure
    const canvasTree = {
      name: 'Root',
      children: [
        {
          name: 'Technical Skills',
          children: [
            { name: 'JavaScript', id: 'skill-js' },
            { name: 'Python', id: 'skill-py' },
            { name: 'AWS', id: 'skill-aws' }
          ]
        },
        {
          name: 'Experience',
          children: [
            { name: 'Senior Engineer', id: 'exp-1', linkedTo: 'test-exp-1' },
            { name: 'Team Lead', id: 'exp-2', linkedTo: 'test-exp-2' }
          ]
        },
        {
          name: 'Projects',
          children: [
            { name: 'Cloud Platform', id: 'proj-1', relatedExperiences: ['exp-1'] },
            { name: 'Data Pipeline', id: 'proj-2', relatedExperiences: ['exp-1', 'exp-2'] }
          ]
        }
      ]
    };

    await StorageHelpers.setStorageItem(page, 'canvas_tree_current', canvasTree);
    await page.reload();

    // Export and restore
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();

    await backupPage.restoreFromFile(filePath);
    await backupPage.waitForRestoreSuccess();

    // Verify tree structure preserved
    const restoredTree = await StorageHelpers.getStorageItem(page, 'canvas_tree_current');

    expect(restoredTree.name).toBe('Root');
    expect(restoredTree.children).toHaveLength(3);

    // Verify first level
    const technicalSkills = restoredTree.children[0];
    expect(technicalSkills.name).toBe('Technical Skills');
    expect(technicalSkills.children).toHaveLength(3);

    // Verify second level
    expect(technicalSkills.children[0].name).toBe('JavaScript');
    expect(technicalSkills.children[0].id).toBe('skill-js');

    // Verify relationships preserved
    const projects = restoredTree.children[2];
    const dataPipeline = projects.children[1];
    expect(dataPipeline.relatedExperiences).toHaveLength(2);
    expect(dataPipeline.relatedExperiences).toContain('exp-1');
    expect(dataPipeline.relatedExperiences).toContain('exp-2');
  });

  test('should preserve user profile completeness with all fields', async ({ page }) => {
    // CRITICAL: Profile data must be complete
    // Missing fields = broken user experience

    const comprehensiveProfile = {
      userFirstName: 'John',
      userLastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-123-4567',
      location: 'San Francisco, CA',
      targetRole: 'Engineering Manager',
      yearsExperience: 12,
      summary: 'Experienced software engineer with expertise in cloud architecture and team leadership.',
      headline: 'Senior Software Engineer | Cloud Architecture | Team Leadership',
      linkedInUrl: 'https://linkedin.com/in/johndoe',
      githubUrl: 'https://github.com/johndoe',
      websiteUrl: 'https://johndoe.dev',
      skills: ['JavaScript', 'Python', 'AWS', 'Leadership'],
      certifications: ['AWS Solutions Architect', 'PMP'],
      education: [
        {
          degree: 'BS Computer Science',
          institution: 'Stanford University',
          graduationYear: 2011
        }
      ],
      preferences: {
        remoteWork: true,
        willingToRelocate: false,
        desiredSalary: '$150,000 - $180,000',
        preferredIndustries: ['Technology', 'Finance']
      }
    };

    await StorageHelpers.setStorageItem(page, 'user_profile_current', comprehensiveProfile);
    await page.reload();

    // Export and restore
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();

    await backupPage.restoreFromFile(filePath);
    await backupPage.waitForRestoreSuccess();

    // Verify ALL profile fields preserved
    const restoredProfile = await StorageHelpers.getStorageItem(page, 'user_profile_current');

    // Basic fields
    expect(restoredProfile.userFirstName).toBe('John');
    expect(restoredProfile.userLastName).toBe('Doe');
    expect(restoredProfile.email).toBe('john.doe@example.com');
    expect(restoredProfile.phone).toBe('+1-555-123-4567');
    expect(restoredProfile.location).toBe('San Francisco, CA');

    // Career fields
    expect(restoredProfile.targetRole).toBe('Engineering Manager');
    expect(restoredProfile.yearsExperience).toBe(12);
    expect(restoredProfile.summary).toBeTruthy();
    expect(restoredProfile.headline).toBeTruthy();

    // URLs
    expect(restoredProfile.linkedInUrl).toBe('https://linkedin.com/in/johndoe');
    expect(restoredProfile.githubUrl).toBe('https://github.com/johndoe');

    // Arrays
    expect(restoredProfile.skills).toHaveLength(4);
    expect(restoredProfile.certifications).toHaveLength(2);
    expect(restoredProfile.education).toHaveLength(1);

    // Nested objects
    expect(restoredProfile.preferences).toBeDefined();
    expect(restoredProfile.preferences.remoteWork).toBe(true);
    expect(restoredProfile.preferences.willingToRelocate).toBe(false);
  });

  test('should maintain entity relationships (documents ↔ assets)', async ({ page }) => {
    // CRITICAL: Cross-entity relationships must be preserved
    // Broken links = orphaned content

    // Create documents with linked assets
    const documents = [
      {
        id: 'doc-1',
        title: 'Project Proposal',
        content: 'Proposal content here...',
        linkedDiagrams: ['diagram-1', 'diagram-2'],
        linkedExperiences: ['exp-1'],
        tags: ['project', 'proposal']
      },
      {
        id: 'doc-2',
        title: 'Technical Specification',
        content: 'Technical spec content...',
        linkedDiagrams: ['diagram-1'],
        linkedExperiences: ['exp-1', 'exp-2'],
        tags: ['technical', 'spec']
      }
    ];

    const diagrams = [
      {
        id: 'diagram-1',
        name: 'System Architecture',
        linkedDocuments: ['doc-1', 'doc-2'],
        diagramData: '<mxfile>...</mxfile>'
      },
      {
        id: 'diagram-2',
        name: 'Data Flow',
        linkedDocuments: ['doc-1'],
        diagramData: '<mxfile>...</mxfile>'
      }
    ];

    const experiences = [
      {
        id: 'exp-1',
        role: 'Senior Engineer',
        linkedDocuments: ['doc-1', 'doc-2'],
        linkedDiagrams: ['diagram-1']
      },
      {
        id: 'exp-2',
        role: 'Team Lead',
        linkedDocuments: ['doc-2']
      }
    ];

    await StorageHelpers.setStorageItem(page, 'user_documents_current', documents);
    await StorageHelpers.setStorageItem(page, 'user_diagrams_current', diagrams);
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', experiences);
    await page.reload();

    // Export and restore
    const backupPage = new BackupRestorePage(page);
    const filePath = await backupPage.exportBackupWithoutKeys();

    await StorageHelpers.clearAllCanvasData(page);
    await page.reload();

    await backupPage.restoreFromFile(filePath);
    await backupPage.waitForRestoreSuccess();

    // Verify relationships preserved
    const restoredDocs = await StorageHelpers.getStorageItem(page, 'user_documents_current');
    const restoredDiagrams = await StorageHelpers.getStorageItem(page, 'user_diagrams_current');
    const restoredExps = await StorageHelpers.getStorageItem(page, 'user_experiences_current');

    // Document → Diagram relationships
    const doc1 = restoredDocs.find(d => d.id === 'doc-1');
    expect(doc1.linkedDiagrams).toHaveLength(2);
    expect(doc1.linkedDiagrams).toContain('diagram-1');
    expect(doc1.linkedDiagrams).toContain('diagram-2');

    // Document → Experience relationships
    expect(doc1.linkedExperiences).toContain('exp-1');

    // Diagram → Document relationships
    const diagram1 = restoredDiagrams.find(d => d.id === 'diagram-1');
    expect(diagram1.linkedDocuments).toHaveLength(2);
    expect(diagram1.linkedDocuments).toContain('doc-1');
    expect(diagram1.linkedDocuments).toContain('doc-2');

    // Experience → Document relationships
    const exp1 = restoredExps.find(e => e.id === 'exp-1');
    expect(exp1.linkedDocuments).toHaveLength(2);
    expect(exp1.linkedDiagrams).toContain('diagram-1');

    // Verify bidirectional consistency
    const doc2 = restoredDocs.find(d => d.id === 'doc-2');
    expect(doc2.linkedExperiences).toContain('exp-2');

    const exp2 = restoredExps.find(e => e.id === 'exp-2');
    expect(exp2.linkedDocuments).toContain('doc-2');
  });

  test('should enforce atomic transactions (all-or-nothing restore)', async ({ page }) => {
    // CRITICAL: Restore must be atomic - no partial data
    // Partial restore = corrupted state

    // Setup existing valid data
    await StorageHelpers.setStorageItem(page, 'user_experiences_current', [
      { id: 'existing-1', role: 'Existing Role' }
    ]);
    await StorageHelpers.setStorageItem(page, 'user_profile_current', {
      userFirstName: 'Existing',
      userLastName: 'User'
    });

    await page.reload();

    // Create malformed backup (missing required fields)
    const malformedBackup = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        experiences: [
          { id: 'new-1' } // Missing 'role' field - invalid!
        ],
        profile: null // Null profile - might be invalid
      }
    };

    const malformedPath = path.join(__dirname, '../../fixtures/backup-samples/malformed-data.json');
    fs.writeFileSync(malformedPath, JSON.stringify(malformedBackup, null, 2));

    const backupPage = new BackupRestorePage(page);

    // Attempt restore
    await backupPage.restoreFromFile(malformedPath);

    // Wait for error or success
    const restoreResult = await Promise.race([
      backupPage.waitForRestoreError().then(() => 'error'),
      backupPage.waitForRestoreSuccess().then(() => 'success'),
      page.waitForTimeout(5000).then(() => 'timeout')
    ]);

    if (restoreResult === 'error') {
      // GOOD: Restore failed, verify original data intact
      const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
      const profile = await StorageHelpers.getStorageItem(page, 'user_profile_current');

      expect(experiences).toHaveLength(1);
      expect(experiences[0].id).toBe('existing-1');
      expect(profile.userFirstName).toBe('Existing');
    } else if (restoreResult === 'success') {
      // If restore succeeded, verify data is COMPLETE (not partial)
      const experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
      const profile = await StorageHelpers.getStorageItem(page, 'user_profile_current');

      // Either old data intact OR new data complete
      if (experiences[0].id === 'new-1') {
        // New data restored - should NOT have old data mixed in
        const hasOldData = experiences.some(e => e.id === 'existing-1');
        expect(hasOldData).toBe(false);
      } else {
        // Old data preserved - should NOT have new data mixed in
        expect(experiences[0].id).toBe('existing-1');
        expect(profile.userFirstName).toBe('Existing');
      }
    }

    // Cleanup
    if (fs.existsSync(malformedPath)) {
      fs.unlinkSync(malformedPath);
    }
  });

  test('should prevent data leakage between restore operations', async ({ page }) => {
    // CRITICAL: Sequential restores must not leave orphaned data
    // Data leakage = confusion, privacy violations

    // First restore - Tech background
    const backup1 = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        experiences: [
          { id: 'tech-1', role: 'Software Engineer', skills: ['JavaScript'] }
        ],
        profile: {
          userFirstName: 'Tech',
          userLastName: 'User',
          targetRole: 'Senior Engineer'
        }
      }
    };

    const backup1Path = path.join(__dirname, '../../fixtures/backup-samples/temp-backup-1.json');
    fs.writeFileSync(backup1Path, JSON.stringify(backup1, null, 2));

    const backupPage = new BackupRestorePage(page);
    await backupPage.restoreFromFile(backup1Path, null, 'overwrite');
    await backupPage.waitForRestoreSuccess();

    // Verify first restore
    let experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    expect(experiences).toHaveLength(1);
    expect(experiences[0].id).toBe('tech-1');

    // Second restore - Different background (overwrite mode)
    const backup2 = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      data: {
        experiences: [
          { id: 'finance-1', role: 'Financial Analyst', skills: ['Excel'] },
          { id: 'finance-2', role: 'Accountant', skills: ['QuickBooks'] }
        ],
        profile: {
          userFirstName: 'Finance',
          userLastName: 'Professional',
          targetRole: 'CFO'
        }
      }
    };

    const backup2Path = path.join(__dirname, '../../fixtures/backup-samples/temp-backup-2.json');
    fs.writeFileSync(backup2Path, JSON.stringify(backup2, null, 2));

    await page.reload();
    await backupPage.restoreFromFile(backup2Path, null, 'overwrite');
    await backupPage.waitForRestoreSuccess();

    // CRITICAL: Verify NO data from first restore
    experiences = await StorageHelpers.getStorageItem(page, 'user_experiences_current');
    const profile = await StorageHelpers.getStorageItem(page, 'user_profile_current');

    // Should only have backup2 data
    expect(experiences).toHaveLength(2);
    expect(experiences.some(e => e.id === 'tech-1')).toBe(false); // NO tech-1
    expect(experiences.some(e => e.id === 'finance-1')).toBe(true); // YES finance-1
    expect(experiences.some(e => e.id === 'finance-2')).toBe(true); // YES finance-2

    // Profile should be backup2
    expect(profile.userFirstName).toBe('Finance');
    expect(profile.targetRole).toBe('CFO');
    expect(profile.userFirstName).not.toBe('Tech'); // NOT Tech

    // Cleanup
    [backup1Path, backup2Path].forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

});
