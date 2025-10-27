import { jsPDF } from 'jspdf';

interface OnboardingData {
  clientName: string;
  email?: string;
  companyName: string;
  industry?: string;
  employees?: string;
  revenue?: string;
  location?: string;
  website?: string;
  phone?: string;
  selectedProcesses: any[];
  selectedProjectTypes: string[];
  processAnalyses: any[];
  projectTypeData: any[];
  goals: any[];
  values: any[];
  automations: any[];
  roles: any[];
  integrations: any[];
  goLivePlan: any;
  additionalNotes?: string;
}

export function generateOnboardingPDF(data: OnboardingData): Blob {
  const doc = new jsPDF();
  
  let yPos = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };
  
  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 3;
  };
  
  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    yPos += 5;
    doc.setFillColor(41, 128, 185);
    doc.rect(margin, yPos - 5, maxWidth, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 3, yPos + 2);
    doc.setTextColor(0, 0, 0);
    yPos += 12;
  };
  
  // Title
  doc.setFillColor(52, 73, 94);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Onboarding-Fragebogen', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Waldhauser Sanitär & Heizung', pageWidth / 2, 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPos = 50;
  
  // Section 1: Contact Information
  addSectionHeader('1. Kontaktdaten');
  addText(`Name: ${data.clientName}`, 11, true);
  if (data.email) addText(`E-Mail: ${data.email}`);
  yPos += 5;
  
  // Section 2: Company Information
  addSectionHeader('2. Firmeninformationen');
  addText(`Firmenname: ${data.companyName}`, 11, true);
  if (data.industry) addText(`Branche: ${data.industry}`);
  if (data.employees) addText(`Mitarbeiteranzahl: ${data.employees}`);
  if (data.revenue) addText(`Jahresumsatz: ${data.revenue}`);
  if (data.location) addText(`Standort: ${data.location}`);
  if (data.website) addText(`Website: ${data.website}`);
  if (data.phone) addText(`Telefon: ${data.phone}`);
  yPos += 5;
  
  // Section 3: CRM Phases & Project Types
  addSectionHeader('3. CRM-Phasen & Projekttypen');
  if (data.selectedProcesses && data.selectedProcesses.length > 0) {
    addText('Ausgewählte CRM-Phasen:', 11, true);
    data.selectedProcesses.forEach((process: any) => {
      addText(`• ${process.name || process.id}`);
    });
    yPos += 3;
  }
  if (data.selectedProjectTypes && data.selectedProjectTypes.length > 0) {
    addText('Ausgewählte Projekttypen:', 11, true);
    data.selectedProjectTypes.forEach((type: string) => {
      addText(`• ${type}`);
    });
  }
  yPos += 5;
  
  // Section 4: Process Analysis
  if (data.processAnalyses && data.processAnalyses.length > 0) {
    addSectionHeader('4. Prozessanalyse');
    data.processAnalyses.forEach((analysis: any, index: number) => {
      addText(`Phase ${index + 1}: ${analysis.processName || 'Unbekannt'}`, 11, true);
      if (analysis.currentState) addText(`Aktueller Zustand: ${analysis.currentState}`);
      if (analysis.challenges) addText(`Herausforderungen: ${analysis.challenges}`);
      if (analysis.desiredState) addText(`Gewünschter Zustand: ${analysis.desiredState}`);
      if (analysis.tools) addText(`Verwendete Tools: ${analysis.tools}`);
      yPos += 3;
    });
    yPos += 5;
  }
  
  // Section 5: Goals & Wishes
  if (data.goals && data.goals.length > 0) {
    addSectionHeader('5. Ziele & Wünsche');
    data.goals.forEach((goal: any, index: number) => {
      addText(`Ziel ${index + 1}: ${goal.title || 'Ohne Titel'}`, 11, true);
      if (goal.description) addText(`Beschreibung: ${goal.description}`);
      if (goal.goalType) addText(`Typ: ${goal.goalType}`);
      if (goal.timeline) addText(`Zeitrahmen: ${goal.timeline}`);
      if (goal.priority) addText(`Priorität: ${goal.priority}`);
      yPos += 3;
    });
    yPos += 5;
  }
  
  // Section 6: Company Values
  if (data.values && data.values.length > 0) {
    addSectionHeader('6. Unternehmenswerte');
    data.values.forEach((value: any, index: number) => {
      addText(`Wert ${index + 1}: ${value.valueName || 'Ohne Namen'}`, 11, true);
      if (value.description) addText(`Beschreibung: ${value.description}`);
      if (value.examples) addText(`Beispiele: ${value.examples}`);
      if (value.importance) addText(`Wichtigkeit: ${value.importance}/10`);
      yPos += 3;
    });
    yPos += 5;
  }
  
  // Section 7: Workflow Automation
  if (data.automations && data.automations.length > 0) {
    const enabledAutomations = data.automations.filter((a: any) => a.enabled);
    if (enabledAutomations.length > 0) {
      addSectionHeader('7. Workflow-Automatisierungen');
      addText(`${enabledAutomations.length} Automatisierungen aktiviert:`, 11, true);
      enabledAutomations.forEach((auto: any) => {
        addText(`• ${auto.name}`);
        if (auto.description) addText(`  ${auto.description}`, 9);
      });
      yPos += 5;
    }
  }
  
  // Section 8: Roles & Permissions
  if (data.roles && data.roles.length > 0) {
    addSectionHeader('8. Rollen & Berechtigungen');
    data.roles.forEach((role: any) => {
      addText(`${role.name} (${role.count} Personen)`, 11, true);
      if (role.permissions) {
        const perms = Object.entries(role.permissions)
          .filter(([_, value]) => value === true)
          .map(([key, _]) => key)
          .join(', ');
        if (perms) addText(`Berechtigungen: ${perms}`, 9);
      }
      yPos += 2;
    });
    yPos += 5;
  }
  
  // Section 9: Integrations
  if (data.integrations && data.integrations.length > 0) {
    const enabledIntegrations = data.integrations.filter((i: any) => i.enabled);
    if (enabledIntegrations.length > 0) {
      addSectionHeader('9. Integrationen');
      addText(`${enabledIntegrations.length} Integrationen gewünscht:`, 11, true);
      enabledIntegrations.forEach((integration: any) => {
        addText(`• ${integration.name}`);
        if (integration.config?.provider) addText(`  Provider: ${integration.config.provider}`, 9);
      });
      yPos += 5;
    }
  }
  
  // Section 10: Go-Live Planning
  if (data.goLivePlan && Object.keys(data.goLivePlan).length > 0) {
    addSectionHeader('10. Go-Live Planung');
    const plan = data.goLivePlan;
    if (plan.timeline) {
      const timelineMap: any = {
        asap: 'So schnell wie möglich',
        '1month': 'Innerhalb 1 Monat',
        '3months': 'Innerhalb 3 Monate',
        flexible: 'Flexibel'
      };
      addText(`Zeitplan: ${timelineMap[plan.timeline] || plan.timeline}`);
    }
    if (plan.dataImport) {
      const importMap: any = { yes: 'Ja', no: 'Nein', partial: 'Teilweise' };
      addText(`Datenimport: ${importMap[plan.dataImport] || plan.dataImport}`);
    }
    if (plan.dataSource) addText(`Datenquelle: ${plan.dataSource}`);
    if (plan.trainingNeeds) {
      const trainingMap: any = {
        basic: 'Grundlagen',
        advanced: 'Fortgeschritten',
        extensive: 'Umfassend'
      };
      addText(`Schulungsbedarf: ${trainingMap[plan.trainingNeeds] || plan.trainingNeeds}`);
    }
    if (plan.trainingFormat) {
      const formatMap: any = {
        onsite: 'Vor Ort',
        online: 'Online',
        hybrid: 'Hybrid'
      };
      addText(`Schulungsformat: ${formatMap[plan.trainingFormat] || plan.trainingFormat}`);
    }
    if (plan.pilotUsers) addText(`Pilot-Nutzer: ${plan.pilotUsers}`);
    if (plan.pilotDuration) addText(`Pilot-Dauer: ${plan.pilotDuration} Wochen`);
    if (plan.goLiveDate) addText(`Go-Live Datum: ${plan.goLiveDate}`);
    if (plan.concerns) {
      addText('Bedenken & Herausforderungen:', 11, true);
      addText(plan.concerns);
    }
    yPos += 5;
  }
  
  // Additional Notes
  if (data.additionalNotes) {
    addSectionHeader('Zusätzliche Anmerkungen');
    addText(data.additionalNotes);
  }
  
  // Footer on last page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Seite ${i} von ${totalPages} | Erstellt am ${new Date().toLocaleDateString('de-DE')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  return doc.output('blob');
}

