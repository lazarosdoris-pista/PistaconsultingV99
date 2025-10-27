import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Check, ArrowLeft } from "lucide-react";
import { generateOnboardingPDF } from "@/utils/generateOnboardingPDF";
import ProcessDiagramCRM from "@/components/ProcessDiagramCRM";
import ProcessAnalysisCRM from "@/components/ProcessAnalysisCRM";
import OdooModuleRecommendation from "@/components/OdooModuleRecommendation";
import WorkflowAutomation from "@/components/WorkflowAutomation";
import RolesPermissions from "@/components/RolesPermissions";
import Integrations from "@/components/Integrations";
import GoLivePlanning from "@/components/GoLivePlanning";
import DocumentUpload from "@/components/DocumentUpload";
import AIChatbot from "@/components/AIChatbot";

const TOTAL_STEPS = 11;
const STORAGE_KEY = "onboarding_data";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  benefit: string;
  icon: string;
}

interface ProcessAnalysisData {
  processId: string;
  currentState: string;
  painPoints: string;
  desiredState: string;
  priority: "low" | "medium" | "high";
}

interface OnboardingData {
  currentStep: number;
  clientName: string;
  clientEmail: string;
  companyName: string;
  industry: string;
  foundedYear: string;
  numberOfEmployees: string;
  companyLocation: string;
  website: string;
  description: string;
  selectedProcesses: ProcessStep[];
  selectedProjectTypes: string[];
  processAnalyses: ProcessAnalysisData[];
  projectTypeData: any[];
  goals: Array<{
    goalType: "short_term" | "long_term" | "vision";
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>;
  values: Array<{
    valueName: string;
    description: string;
    examples: string;
    importance: number;
  }>;
  automations: any[];
  roles: any[];
  integrations: any[];
  goLivePlan: any;
  additionalNotes: string;
  step1Comments: string;
  step2Comments: string;
  step3Comments: string;
  step6Comments: string;
  step7Comments: string;
  step8Comments: string;
  step9Comments: string;
  step10Comments: string;
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Client Information
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  // Step 2: Company Information
  const [companyName, setCompanyName] = useState("Waldhauser Sanitär & Heizung");
  const [industry, setIndustry] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  
  // Step 3: Business Processes (CRM + Projects)
  const [selectedProcesses, setSelectedProcesses] = useState<ProcessStep[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [processAnalyses, setProcessAnalyses] = useState<ProcessAnalysisData[]>([]);
  const [projectTypeData, setProjectTypeData] = useState<any[]>([]);
  const [showProcessAnalysis, setShowProcessAnalysis] = useState(false);
  
  // Step 4: Goals and Wishes
  const [goals, setGoals] = useState<Array<{
    goalType: "short_term" | "long_term" | "vision";
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>>([]);
  
  // Step 5: Company Values
  const [values, setValues] = useState<Array<{
    valueName: string;
    description: string;
    examples: string;
    importance: number;
  }>>([]);

  // Step 7: Workflow Automation
  const [automations, setAutomations] = useState<any[]>([]);
  
  // Step 8: Roles & Permissions
  const [roles, setRoles] = useState<any[]>([]);
  
  // Step 9: Integrations
  const [integrations, setIntegrations] = useState<any[]>([]);
  
  // Step 10: Go-Live Planning
  const [goLivePlan, setGoLivePlan] = useState<any>({});
  
  // Additional Notes & Comments for each step
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step1Comments, setStep1Comments] = useState("");
  const [step2Comments, setStep2Comments] = useState("");
  const [step3Comments, setStep3Comments] = useState("");
  const [step6Comments, setStep6Comments] = useState("");
  const [step7Comments, setStep7Comments] = useState("");
  const [step8Comments, setStep8Comments] = useState("");
  const [step9Comments, setStep9Comments] = useState("");
  const [step10Comments, setStep10Comments] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data: OnboardingData = JSON.parse(savedData);
        setCurrentStep(data.currentStep || 1);
        setClientName(data.clientName || "");
        setClientEmail(data.clientEmail || "");
        setCompanyName(data.companyName || "Waldhauser Sanitär & Heizung");
        setIndustry(data.industry || "");
        setFoundedYear(data.foundedYear || "");
        setNumberOfEmployees(data.numberOfEmployees || "");
        setCompanyLocation(data.companyLocation || "");
        setWebsite(data.website || "");
        setDescription(data.description || "");
        setSelectedProcesses(data.selectedProcesses || []);
        setSelectedProjectTypes(data.selectedProjectTypes || []);
        setProcessAnalyses(data.processAnalyses || []);
        setProjectTypeData(data.projectTypeData || []);
        setGoals(data.goals || []);
        setValues(data.values || []);
        setAutomations(data.automations || []);
        setRoles(data.roles || []);
        setIntegrations(data.integrations || []);
        setGoLivePlan(data.goLivePlan || {});
        setAdditionalNotes(data.additionalNotes || "");
        setStep1Comments(data.step1Comments || "");
        setStep2Comments(data.step2Comments || "");
        setStep3Comments(data.step3Comments || "");
        setStep6Comments(data.step6Comments || "");
        setStep7Comments(data.step7Comments || "");
        setStep8Comments(data.step8Comments || "");
        setStep9Comments(data.step9Comments || "");
        setStep10Comments(data.step10Comments || "");
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  const saveToLocalStorage = () => {
    const data: OnboardingData = {
      currentStep,
      clientName,
      clientEmail,
      companyName,
      industry,
      foundedYear,
      numberOfEmployees,
      companyLocation,
      website,
      description,
      selectedProcesses,
      selectedProjectTypes,
      processAnalyses,
      projectTypeData,
      goals,
      values,
      automations,
      roles,
      integrations,
      goLivePlan,
      additionalNotes,
      step1Comments,
      step2Comments,
      step3Comments,
      step6Comments,
      step7Comments,
      step8Comments,
      step9Comments,
      step10Comments,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleStartOnboarding = () => {
    if (!clientName || !clientName.trim()) {
      toast.error("Bitte geben Sie Ihren Namen ein");
      return;
    }
    
    setCurrentStep(2);
    saveToLocalStorage();
    toast.success("Willkommen! Lassen Sie uns beginnen.");
  };

  const handleSaveCompanyInfo = () => {
    if (!companyName || !companyName.trim()) {
      toast.error("Bitte geben Sie den Firmennamen ein");
      return;
    }
    
    setCurrentStep(3);
    saveToLocalStorage();
    toast.success("Firmeninformationen gespeichert");
  };

  const handleProcessesConfirmed = (processes: ProcessStep[], projectTypes: string[]) => {
    setSelectedProcesses(processes);
    setSelectedProjectTypes(projectTypes);
    setShowProcessAnalysis(true);
    saveToLocalStorage();
  };

  const handleProcessAnalysisComplete = (analyses: ProcessAnalysisData[], projTypeData: any[]) => {
    setProcessAnalyses(analyses);
    setProjectTypeData(projTypeData);
    setCurrentStep(4);
    saveToLocalStorage();
    toast.success("Prozessanalyse gespeichert");
  };

  const handleBackToProcessSelection = () => {
    setShowProcessAnalysis(false);
  };

  const handleAddGoal = () => {
    setGoals([...goals, {
      goalType: "short_term",
      title: "",
      description: "",
      priority: "medium",
    }]);
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSaveGoals = () => {
    if (goals.length === 0) {
      toast.error("Bitte fügen Sie mindestens ein Ziel hinzu");
      return;
    }
    
    const hasEmptyTitles = goals.some(g => !g.title || !g.title.trim());
    if (hasEmptyTitles) {
      toast.error("Bitte geben Sie für alle Ziele einen Titel ein");
      return;
    }
    
    setCurrentStep(5);
    saveToLocalStorage();
    toast.success("Ziele gespeichert");
  };

  const handleAddValue = () => {
    setValues([...values, {
      valueName: "",
      description: "",
      examples: "",
      importance: 5,
    }]);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSaveValues = () => {
    if (values.length === 0) {
      toast.error("Bitte fügen Sie mindestens einen Wert hinzu");
      return;
    }
    
    const hasEmptyNames = values.some(v => !v.valueName || !v.valueName.trim());
    if (hasEmptyNames) {
      toast.error("Bitte geben Sie für alle Werte einen Namen ein");
      return;
    }
    
    setCurrentStep(6);
    saveToLocalStorage();
    toast.success("Unternehmenswerte gespeichert");
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate PDF
      const pdfBlob = generateOnboardingPDF({
        clientName,
        email: clientEmail,
        companyName,
        industry,
        employees: numberOfEmployees,
        revenue: '',
        location: companyLocation,
        website,
        phone: '',
        selectedProcesses,
        selectedProjectTypes,
        processAnalyses,
        projectTypeData,
        goals,
        values,
        automations,
        roles,
        integrations,
        goLivePlan,
        additionalNotes
      });
      
      // Prepare all data for email submission
      const formData = new FormData();
      
      // Add PDF attachment
      formData.append("attachment", pdfBlob, `Onboarding_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Add all onboarding data to form
      formData.append("_subject", `Neues Onboarding: ${companyName}`);
      formData.append("Client Name", clientName);
      formData.append("Client Email", clientEmail);
      formData.append("Company Name", companyName);
      formData.append("Industry", industry);
      formData.append("Founded Year", foundedYear);
      formData.append("Number of Employees", numberOfEmployees);
      formData.append("Location", companyLocation);
      formData.append("Website", website);
      formData.append("Description", description);
      
      // Add processes
      formData.append("Selected Processes", JSON.stringify(selectedProcesses, null, 2));
      formData.append("Process Analyses", JSON.stringify(processAnalyses, null, 2));
      formData.append("Project Types", JSON.stringify(selectedProjectTypes, null, 2));
      
      // Add goals
      formData.append("Goals", JSON.stringify(goals, null, 2));
      
      // Add values
      formData.append("Company Values", JSON.stringify(values, null, 2));
      
      // Add automations, roles, integrations, go-live plan
      formData.append("Automations", JSON.stringify(automations, null, 2));
      formData.append("Roles & Permissions", JSON.stringify(roles, null, 2));
      formData.append("Integrations", JSON.stringify(integrations, null, 2));
      formData.append("Go-Live Plan", JSON.stringify(goLivePlan, null, 2));
      
      // Add comments
      formData.append("Additional Notes", additionalNotes);
      formData.append("Step 1 Comments", step1Comments);
      formData.append("Step 2 Comments", step2Comments);
      formData.append("Step 3 Comments", step3Comments);
      formData.append("Step 6 Comments", step6Comments);
      formData.append("Step 7 Comments", step7Comments);
      formData.append("Step 8 Comments", step8Comments);
      formData.append("Step 9 Comments", step9Comments);
      formData.append("Step 10 Comments", step10Comments);
      
      // Submit to FormSubmit
      const response = await fetch("https://formsubmit.co/fl@leibinger-am.de", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        // Clear localStorage after successful submission
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Onboarding erfolgreich abgeschlossen!");
        setTimeout(() => navigate("/success"), 1500);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Fehler beim Absenden. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <img src="/pista-logo.png" alt="PISTA Consulting" className="h-12" />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Waldhauser Sanitär & Heizung</p>
              <p className="text-xs text-muted-foreground">Onboarding Portal</p>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Schritt {currentStep} von {TOTAL_STEPS}
          </p>
        </div>

        {/* Step 1: Client Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Willkommen bei PISTA Consulting</CardTitle>
              <CardDescription>
                Wir freuen uns, Sie bei der digitalen Transformation zu begleiten. Lassen Sie uns mit Ihren Kontaktdaten beginnen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">E-Mail</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
              <div>
                <Label htmlFor="step1Comments">Zusätzliche Anmerkungen (optional)</Label>
                <Textarea
                  id="step1Comments"
                  value={step1Comments}
                  onChange={(e) => setStep1Comments(e.target.value)}
                  placeholder="Haben Sie weitere Informationen, die Sie hinzufügen möchten?"
                />
              </div>
              <Button onClick={handleStartOnboarding} className="w-full">
                Weiter
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Company Information */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Firmeninformationen</CardTitle>
              <CardDescription>
                Erzählen Sie uns mehr über Waldhauser Sanitär & Heizung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Firmenname *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Waldhauser Sanitär & Heizung"
                />
              </div>
              <div>
                <Label htmlFor="industry">Branche</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="z.B. Handwerk, Sanitär"
                />
              </div>
              <div>
                <Label htmlFor="foundedYear">Gründungsjahr</Label>
                <Input
                  id="foundedYear"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  placeholder="z.B. 1990"
                />
              </div>
              <div>
                <Label htmlFor="numberOfEmployees">Anzahl Mitarbeiter</Label>
                <Input
                  id="numberOfEmployees"
                  value={numberOfEmployees}
                  onChange={(e) => setNumberOfEmployees(e.target.value)}
                  placeholder="z.B. 15"
                />
              </div>
              <div>
                <Label htmlFor="companyLocation">Standort</Label>
                <Input
                  id="companyLocation"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  placeholder="z.B. Grünwald"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.beispiel.de"
                />
              </div>
              <div>
                <Label htmlFor="description">Firmenbeschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreiben Sie Ihr Unternehmen, Ihre Dienstleistungen und was Sie besonders macht..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="step2Comments">Zusätzliche Anmerkungen (optional)</Label>
                <Textarea
                  id="step2Comments"
                  value={step2Comments}
                  onChange={(e) => setStep2Comments(e.target.value)}
                  placeholder="Haben Sie weitere Informationen, die Sie hinzufügen möchten?"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleSaveCompanyInfo} className="flex-1">
                  Weiter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Processes */}
        {currentStep === 3 && !showProcessAnalysis && (
          <ProcessDiagramCRM
            onConfirm={handleProcessesConfirmed}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 3 && showProcessAnalysis && (
          <ProcessAnalysisCRM
            selectedProcesses={selectedProcesses}
            selectedProjectTypes={selectedProjectTypes}
            onComplete={handleProcessAnalysisComplete}
            onBack={handleBackToProcessSelection}
          />
        )}

        {/* Step 4: Goals and Wishes */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Ziele & Wünsche</CardTitle>
              <CardDescription>
                Definieren Sie Ihre kurz- und langfristigen Ziele sowie Ihre Vision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label>Zieltyp</Label>
                          <Select
                            value={goal.goalType}
                            onValueChange={(value: any) => {
                              const newGoals = [...goals];
                              newGoals[index].goalType = value;
                              setGoals(newGoals);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short_term">Kurzfristig (0-6 Monate)</SelectItem>
                              <SelectItem value="long_term">Langfristig (6-24 Monate)</SelectItem>
                              <SelectItem value="vision">Vision (2+ Jahre)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Titel</Label>
                          <Input
                            value={goal.title}
                            onChange={(e) => {
                              const newGoals = [...goals];
                              newGoals[index].title = e.target.value;
                              setGoals(newGoals);
                            }}
                            placeholder="z.B. Digitalisierung der Auftragsabwicklung"
                          />
                        </div>
                        <div>
                          <Label>Beschreibung</Label>
                          <Textarea
                            value={goal.description}
                            onChange={(e) => {
                              const newGoals = [...goals];
                              newGoals[index].description = e.target.value;
                              setGoals(newGoals);
                            }}
                            placeholder="Beschreiben Sie das Ziel im Detail..."
                          />
                        </div>
                        <div>
                          <Label>Priorität</Label>
                          <Select
                            value={goal.priority}
                            onValueChange={(value: any) => {
                              const newGoals = [...goals];
                              newGoals[index].priority = value;
                              setGoals(newGoals);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Niedrig</SelectItem>
                              <SelectItem value="medium">Mittel</SelectItem>
                              <SelectItem value="high">Hoch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGoal(index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button onClick={handleAddGoal} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Ziel hinzufügen
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleSaveGoals} className="flex-1">
                  Weiter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Company Values */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Unternehmenswerte</CardTitle>
              <CardDescription>
                Definieren Sie die Werte, die Ihr Unternehmen prägen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((value, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        <div>
                          <Label>Wertename</Label>
                          <Input
                            value={value.valueName}
                            onChange={(e) => {
                              const newValues = [...values];
                              newValues[index].valueName = e.target.value;
                              setValues(newValues);
                            }}
                            placeholder="z.B. Kundenorientierung"
                          />
                        </div>
                        <div>
                          <Label>Beschreibung</Label>
                          <Textarea
                            value={value.description}
                            onChange={(e) => {
                              const newValues = [...values];
                              newValues[index].description = e.target.value;
                              setValues(newValues);
                            }}
                            placeholder="Was bedeutet dieser Wert für Ihr Unternehmen?"
                          />
                        </div>
                        <div>
                          <Label>Beispiele</Label>
                          <Textarea
                            value={value.examples}
                            onChange={(e) => {
                              const newValues = [...values];
                              newValues[index].examples = e.target.value;
                              setValues(newValues);
                            }}
                            placeholder="Konkrete Beispiele, wie dieser Wert gelebt wird..."
                          />
                        </div>
                        <div>
                          <Label>Wichtigkeit (1-10)</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={value.importance}
                            onChange={(e) => {
                              const newValues = [...values];
                              newValues[index].importance = parseInt(e.target.value) || 5;
                              setValues(newValues);
                            }}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveValue(index)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button onClick={handleAddValue} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Wert hinzufügen
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button onClick={handleSaveValues} className="flex-1">
                  Weiter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Odoo Module Recommendations */}
        {currentStep === 6 && (
          <OdooModuleRecommendation
            selectedCRMStages={(selectedProcesses || []).map(p => p.id)}
            selectedProjectTypes={selectedProjectTypes || []}
            onComplete={() => {
              setCurrentStep(7);
              saveToLocalStorage();
              toast.success("Modul-Empfehlungen gespeichert");
            }}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {/* Step 7: Workflow Automation */}
        {currentStep === 7 && (
          <WorkflowAutomation
            onAutomationsChange={(automationData) => {
              setAutomations(automationData);
            }}
            onComplete={() => {
              setCurrentStep(8);
              saveToLocalStorage();
              toast.success("Workflow-Automatisierungen gespeichert");
            }}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {/* Step 8: Roles & Permissions */}
        {currentStep === 8 && (
          <RolesPermissions
            onRolesChange={(rolesData) => {
              setRoles(rolesData);
            }}
            onComplete={() => {
              setCurrentStep(9);
              saveToLocalStorage();
              toast.success("Rollen & Berechtigungen gespeichert");
            }}
            onBack={() => setCurrentStep(7)}
          />
        )}

        {/* Step 9: Integrations */}
        {currentStep === 9 && (
          <Integrations
            onIntegrationsChange={(integrationsData) => {
              setIntegrations(integrationsData);
            }}
            onComplete={() => {
              setCurrentStep(10);
              saveToLocalStorage();
              toast.success("Integrationen gespeichert");
            }}
            onBack={() => setCurrentStep(8)}
          />
        )}

        {/* Step 10: Go-Live Planning */}
        {currentStep === 10 && (
          <GoLivePlanning
            onPlanChange={(planData) => {
              setGoLivePlan(planData);
            }}
            onComplete={() => {
              setCurrentStep(11);
              saveToLocalStorage();
              toast.success("Go-Live Planung gespeichert");
            }}
            onBack={() => setCurrentStep(9)}
          />
        )}

        {/* Step 11: Final Review & Submit */}
        {currentStep === 11 && (
          <Card>
            <CardHeader>
              <CardTitle>Zusammenfassung & Abschluss</CardTitle>
              <CardDescription>
                Überprüfen Sie Ihre Angaben und schließen Sie das Onboarding ab.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Kontaktdaten</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {clientName}<br />
                  <strong>E-Mail:</strong> {clientEmail || "Nicht angegeben"}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Firmeninformationen</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Firma:</strong> {companyName}<br />
                  <strong>Branche:</strong> {industry || "Nicht angegeben"}<br />
                  <strong>Mitarbeiter:</strong> {numberOfEmployees || "Nicht angegeben"}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Geschäftsprozesse</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedProcesses.length} Prozesse ausgewählt
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Ziele</h3>
                <p className="text-sm text-muted-foreground">
                  {goals.length} Ziele definiert
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Unternehmenswerte</h3>
                <p className="text-sm text-muted-foreground">
                  {values.length} Werte definiert
                </p>
              </div>
              
              <div>
                <Label htmlFor="additionalNotes">Abschließende Anmerkungen (optional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Gibt es noch etwas, das Sie uns mitteilen möchten?"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(10)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Onboarding abschließen
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

