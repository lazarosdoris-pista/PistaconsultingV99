import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Download,
  FileText,
  LogOut,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [onboardingData, setOnboardingData] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Load data from localStorage
      const data = localStorage.getItem('onboarding_data');
      if (data) {
        try {
          setOnboardingData(JSON.parse(data));
        } catch (e) {
          console.error('Failed to parse onboarding data:', e);
        }
      }
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "PISTA" && password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Ungültige Anmeldedaten");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const generateMarkdownContent = () => {
    if (!onboardingData) return "";

    let markdown = `# Onboarding Report: ${onboardingData.companyName || 'Unbekannt'}\n\n`;
    markdown += `**Erstellt am:** ${new Date().toLocaleDateString('de-DE')}\n\n`;
    markdown += `---\n\n`;

    markdown += `## Firmeninformationen\n\n`;
    markdown += `- **Firmenname:** ${onboardingData.companyName || 'N/A'}\n`;
    if (onboardingData.industry) markdown += `- **Branche:** ${onboardingData.industry}\n`;
    if (onboardingData.employees) markdown += `- **Mitarbeiter:** ${onboardingData.employees}\n`;
    if (onboardingData.location) markdown += `- **Standort:** ${onboardingData.location}\n`;
    if (onboardingData.website) markdown += `- **Website:** ${onboardingData.website}\n`;
    markdown += `\n`;

    if (onboardingData.crmStages) {
      markdown += `## CRM Prozess\n\n`;
      markdown += `**Ausgewählte Stages:** ${onboardingData.crmStages.join(', ')}\n\n`;
    }

    if (onboardingData.projectTypes) {
      markdown += `## Projekt Typen\n\n`;
      onboardingData.projectTypes.forEach((type: any) => {
        markdown += `### ${type.name}\n`;
        markdown += `**Stages:** ${type.stages.join(', ')}\n\n`;
      });
    }

    if (onboardingData.modules) {
      markdown += `## Empfohlene Odoo Module\n\n`;
      onboardingData.modules.forEach((module: string) => {
        markdown += `- ${module}\n`;
      });
      markdown += `\n`;
    }

    if (onboardingData.automations) {
      markdown += `## Workflow Automatisierungen\n\n`;
      onboardingData.automations.forEach((auto: any) => {
        markdown += `### ${auto.name}\n`;
        if (auto.description) markdown += `${auto.description}\n\n`;
      });
    }

    if (onboardingData.roles) {
      markdown += `## Rollen & Berechtigungen\n\n`;
      onboardingData.roles.forEach((role: any) => {
        markdown += `### ${role.name}\n`;
        if (role.permissions) markdown += `**Berechtigungen:** ${role.permissions.join(', ')}\n\n`;
      });
    }

    if (onboardingData.integrations) {
      markdown += `## Integrationen\n\n`;
      onboardingData.integrations.forEach((integration: string) => {
        markdown += `- ${integration}\n`;
      });
      markdown += `\n`;
    }

    if (onboardingData.goLive) {
      markdown += `## Go-Live Planung\n\n`;
      const gl = onboardingData.goLive;
      if (gl.timeline) markdown += `**Timeline:** ${gl.timeline}\n`;
      if (gl.dataImport) markdown += `**Datenimport:** ${gl.dataImport}\n`;
      if (gl.training) markdown += `**Schulung:** ${gl.training}\n`;
      if (gl.pilot) markdown += `**Pilot Phase:** ${gl.pilot}\n`;
      markdown += `\n`;
    }

    return markdown;
  };

  const exportToMarkdown = () => {
    if (!onboardingData) return;

    const markdown = generateMarkdownContent();
    if (!markdown) return;

    const filename = `onboarding-${(onboardingData.companyName || 'export').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/pista-logo.png" alt="PISTA Consulting" className="h-12" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Bitte melden Sie sich an</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="PISTA"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              {loginError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                Anmelden
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/pista-logo.png" alt="PISTA Consulting" className="h-10" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Onboarding Auswertung</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </header>

      <div className="container max-w-7xl py-8">
        {!onboardingData ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Daten gefunden</h3>
                <p className="text-muted-foreground">
                  Es wurden noch keine Onboarding-Daten in diesem Browser gespeichert.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Hinweis: In der statischen Version werden Daten nur im Browser localStorage gespeichert.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-8 w-8 text-accent" />
                    <div>
                      <CardTitle className="text-2xl">{onboardingData.companyName || 'Unbekannt'}</CardTitle>
                      <CardDescription>Onboarding Daten</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={exportToMarkdown} variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Markdown
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Data Tabs */}
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="company">Firma</TabsTrigger>
                <TabsTrigger value="processes">Prozesse</TabsTrigger>
                <TabsTrigger value="modules">Module</TabsTrigger>
                <TabsTrigger value="planning">Planung</TabsTrigger>
              </TabsList>

              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Firmeninformationen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {onboardingData.companyName || 'N/A'}</div>
                    {onboardingData.industry && <div><strong>Branche:</strong> {onboardingData.industry}</div>}
                    {onboardingData.employees && <div><strong>Mitarbeiter:</strong> {onboardingData.employees}</div>}
                    {onboardingData.location && <div><strong>Standort:</strong> {onboardingData.location}</div>}
                    {onboardingData.website && <div><strong>Website:</strong> {onboardingData.website}</div>}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="processes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>CRM & Projekt Prozesse</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {onboardingData.crmStages && (
                      <div>
                        <strong>CRM Stages:</strong>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {onboardingData.crmStages.map((stage: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {stage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {onboardingData.projectTypes && onboardingData.projectTypes.length > 0 && (
                      <div>
                        <strong>Projekt Typen:</strong>
                        {onboardingData.projectTypes.map((type: any, i: number) => (
                          <div key={i} className="mt-2">
                            <div className="font-medium">{type.name}</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {type.stages.map((stage: string, j: number) => (
                                <span key={j} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  {stage}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Odoo Module & Integrationen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {onboardingData.modules && onboardingData.modules.length > 0 && (
                      <div>
                        <strong>Empfohlene Module:</strong>
                        <ul className="mt-2 list-disc list-inside">
                          {onboardingData.modules.map((module: string, i: number) => (
                            <li key={i}>{module}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {onboardingData.integrations && onboardingData.integrations.length > 0 && (
                      <div>
                        <strong>Integrationen:</strong>
                        <ul className="mt-2 list-disc list-inside">
                          {onboardingData.integrations.map((integration: string, i: number) => (
                            <li key={i}>{integration}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planning" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Go-Live Planung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {onboardingData.goLive ? (
                      <div className="space-y-2">
                        {onboardingData.goLive.timeline && <div><strong>Timeline:</strong> {onboardingData.goLive.timeline}</div>}
                        {onboardingData.goLive.dataImport && <div><strong>Datenimport:</strong> {onboardingData.goLive.dataImport}</div>}
                        {onboardingData.goLive.training && <div><strong>Schulung:</strong> {onboardingData.goLive.training}</div>}
                        {onboardingData.goLive.pilot && <div><strong>Pilot Phase:</strong> {onboardingData.goLive.pilot}</div>}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Keine Go-Live Daten verfügbar</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

