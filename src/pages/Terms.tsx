/**
 * Terms of Service Page - Aurion Studio
 * 
 * SEO: Conditions utilisation Aurion, CGU SaaS, termes service plateforme
 */

import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, CreditCard, AlertTriangle, Scale, RefreshCw, HelpCircle } from "lucide-react";

const Terms = () => {
  const lastUpdate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 lg:px-16 py-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#D4FF00]/10 rounded-xl">
            <FileText className="w-8 h-8 text-[#D4FF00]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Conditions d'Utilisation</h1>
            <p className="text-white/50">Dernière mise à jour : {lastUpdate}</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-[#D4FF00] mb-2">📋 Points clés à retenir</h2>
          <ul className="text-white/80 space-y-1 text-sm">
            <li>• Vous gardez la propriété de tout le contenu que vous créez</li>
            <li>• Votre abonnement peut être annulé à tout moment</li>
            <li>• Nous nous engageons à 99.9% de disponibilité (plans Pro/Enterprise)</li>
            <li>• Utilisation interdite pour activités illégales ou nuisibles</li>
          </ul>
        </div>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">1. Acceptation des conditions</h2>
            </div>
            <p className="mb-3">
              En accédant ou en utilisant Aurion Studio ("le Service"), vous acceptez d'être lié 
              par ces conditions d'utilisation ("CGU"). Si vous n'acceptez pas ces conditions, 
              veuillez ne pas utiliser le Service.
            </p>
            <p className="text-sm text-white/50">
              Ces CGU constituent un accord juridiquement contraignant entre vous et Aurion Studio SAS.
            </p>
          </section>
          
          {/* Section 2 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">2. Description du service</h2>
            </div>
            <p className="mb-3">
              Aurion Studio est une plateforme SaaS de développement qui inclut :
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60 mb-3">
              <li>Un éditeur de code avancé avec support multi-langages</li>
              <li>Un constructeur d'applications no-code/low-code</li>
              <li>Un assistant IA pour le développement</li>
              <li>Un système de chat et collaboration</li>
              <li>Un éditeur de texte et documentation</li>
              <li>Des outils de monitoring et workflow</li>
            </ul>
            <p className="text-sm text-white/50">
              Les fonctionnalités disponibles varient selon votre plan d'abonnement.
            </p>
          </section>
          
          {/* Section 3 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">3. Votre compte</h2>
            </div>
            <div className="space-y-3">
              <p><strong className="text-white">Création :</strong> Vous devez fournir des informations exactes lors de l'inscription.</p>
              <p><strong className="text-white">Sécurité :</strong> Vous êtes responsable de la confidentialité de vos identifiants et de toute activité sous votre compte.</p>
              <p><strong className="text-white">Âge minimum :</strong> Vous devez avoir au moins 16 ans pour utiliser le Service.</p>
              <p><strong className="text-white">Notification :</strong> Prévenez-nous immédiatement en cas d'utilisation non autorisée à <a href="mailto:security@aurion.studio" className="text-[#D4FF00] hover:underline">security@aurion.studio</a>.</p>
            </div>
          </section>
          
          {/* Section 4 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">4. Abonnement et paiement</h2>
            </div>
            <div className="space-y-3">
              <p><strong className="text-white">Facturation :</strong> Les abonnements sont facturés mensuellement ou annuellement selon votre choix.</p>
              <p><strong className="text-white">Renouvellement :</strong> Votre abonnement se renouvelle automatiquement sauf annulation.</p>
              <p><strong className="text-white">Annulation :</strong> Vous pouvez annuler à tout moment. L'accès reste actif jusqu'à la fin de la période payée.</p>
              <p><strong className="text-white">Remboursement :</strong> Garantie satisfait ou remboursé de 30 jours pour les nouveaux abonnements.</p>
              <p><strong className="text-white">Prix :</strong> Nous nous réservons le droit de modifier les prix avec un préavis de 30 jours.</p>
            </div>
          </section>
          
          {/* Section 5 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">5. Propriété intellectuelle</h2>
            </div>
            <div className="space-y-3">
              <p><strong className="text-white">Votre contenu :</strong> Vous conservez tous les droits sur le contenu que vous créez. Vous nous accordez une licence limitée pour l'héberger et l'afficher.</p>
              <p><strong className="text-white">Notre service :</strong> Aurion Studio, son code, design et contenu sont notre propriété exclusive et protégés par les lois sur la propriété intellectuelle.</p>
              <p><strong className="text-white">Feedback :</strong> Toute suggestion ou amélioration que vous nous soumettez peut être utilisée sans obligation de compensation.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">6. Utilisation acceptable</h2>
            </div>
            <p className="mb-3">Vous vous engagez à <strong className="text-red-400">NE PAS</strong> utiliser le Service pour :</p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Violer des lois ou réglementations applicables</li>
              <li>Distribuer des malwares, virus ou code malveillant</li>
              <li>Harceler, menacer ou porter atteinte à d'autres utilisateurs</li>
              <li>Usurper l'identité d'une personne ou organisation</li>
              <li>Tenter d'accéder à des données non autorisées</li>
              <li>Surcharger ou perturber notre infrastructure</li>
              <li>Revendre le Service sans autorisation</li>
            </ul>
            <p className="text-sm text-white/50 mt-3">
              Toute violation peut entraîner la suspension ou résiliation immédiate de votre compte.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">7. Disponibilité et limitation</h2>
            </div>
            <div className="space-y-3">
              <p><strong className="text-white">Disponibilité :</strong> Nous visons une disponibilité de 99.9% pour les plans Pro et Enterprise (SLA).</p>
              <p><strong className="text-white">Maintenance :</strong> Nous pouvons interrompre temporairement le Service pour maintenance, avec préavis si possible.</p>
              <p><strong className="text-white">Limitation de responsabilité :</strong> Aurion Studio ne sera pas responsable des dommages indirects, pertes de données ou manques à gagner résultant de l'utilisation du Service.</p>
              <p><strong className="text-white">Responsabilité maximale :</strong> Notre responsabilité totale est limitée au montant que vous avez payé au cours des 12 derniers mois.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">8. Modifications et résiliation</h2>
            </div>
            <div className="space-y-3">
              <p><strong className="text-white">Modifications des CGU :</strong> Nous pouvons modifier ces conditions. Les changements importants seront notifiés 30 jours à l'avance.</p>
              <p><strong className="text-white">Résiliation par vous :</strong> Vous pouvez fermer votre compte à tout moment depuis les paramètres.</p>
              <p><strong className="text-white">Résiliation par nous :</strong> Nous pouvons suspendre ou résilier votre accès en cas de violation des CGU.</p>
              <p><strong className="text-white">Après résiliation :</strong> Vous pouvez demander l'export de vos données dans les 30 jours suivant la résiliation.</p>
            </div>
          </section>

          {/* Section 9 - Contact */}
          <section className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">9. Contact et litiges</h2>
            <div className="space-y-3">
              <p><strong className="text-white">Droit applicable :</strong> Ces CGU sont régies par le droit français.</p>
              <p><strong className="text-white">Juridiction :</strong> Tout litige sera soumis aux tribunaux compétents de Paris, France.</p>
              <p><strong className="text-white">Questions :</strong> Pour toute question sur ces CGU, contactez-nous :</p>
              <p className="pl-4">
                📧 <a href="mailto:legal@aurion.studio" className="text-[#D4FF00] hover:underline">legal@aurion.studio</a><br />
                📍 Aurion Studio SAS, 123 Avenue des Champs-Élysées, 75008 Paris
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-white/40 pt-8 border-t border-white/10">
            <p>En utilisant Aurion Studio, vous confirmez avoir lu et accepté ces conditions.</p>
            <p className="mt-2">
              <Link to="/privacy" className="hover:text-white">Confidentialité</Link>
              {" • "}
              <Link to="/legal" className="hover:text-white">Mentions légales</Link>
              {" • "}
              <Link to="/cookies" className="hover:text-white">Cookies</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
