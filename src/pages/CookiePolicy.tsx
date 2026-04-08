import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Shield, Eye, Settings } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <Cookie className="w-10 h-10 text-orange-500" />
            Política de Cookies
          </h1>
          <p className="text-gray-600">
            Saiba como utilizamos cookies para melhorar sua experiência em nosso site.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-orange-500" />
                O que são Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site.
                Eles ajudam a melhorar sua experiência, lembrando suas preferências e permitindo funcionalidades
                essenciais do site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Como Utilizamos Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies Essenciais</h4>
                  <p className="text-gray-600">
                    Necessários para o funcionamento básico do site, como autenticação e navegação segura.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies de Desempenho</h4>
                  <p className="text-gray-600">
                    Nos ajudam a entender como os visitantes interagem com o site, melhorando a experiência do usuário.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cookies de Funcionalidade</h4>
                  <p className="text-gray-600">
                    Permitem que o site lembre suas preferências e configurações pessoais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Cookies de Terceiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Utilizamos serviços de terceiros como Google Analytics e Firebase para análise de tráfego
                e autenticação. Estes serviços podem definir seus próprios cookies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" />
                Gerenciamento de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Você pode controlar e excluir cookies através das configurações do seu navegador:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Chrome: Configurações → Privacidade e segurança → Cookies</li>
                  <li>Firefox: Preferências → Privacidade e Segurança → Cookies</li>
                  <li>Safari: Preferências → Privacidade → Gerenciar dados do site</li>
                  <li>Edge: Configurações → Cookies e permissões do site</li>
                </ul>
                <p className="text-gray-600">
                  Observe que desabilitar cookies pode afetar a funcionalidade do site.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Se você tiver dúvidas sobre nossa política de cookies, entre em contato conosco
                através da página de contato do site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;