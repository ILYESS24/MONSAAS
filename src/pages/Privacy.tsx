/**
 * Privacy Policy Page - Aurion Studio
 * 
 * SEO: Politique confidentialité Aurion, RGPD SaaS, protection données
 * 
 * Conforme RGPD avec langage clair et accessible.
 */

import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Trash2, Download, Bell, Globe, Mail } from "lucide-react";

const Privacy = () => {
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
            <Shield className="w-8 h-8 text-[#D4FF00]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">Politique de Confidentialité</h1>
            <p className="text-white/50">Dernière mise à jour : {lastUpdate}</p>
          </div>
        </div>

        {/* TL;DR Box */}
        <div className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-[#D4FF00] mb-2">🔒 En résumé (TL;DR)</h2>
          <ul className="text-white/80 space-y-1 text-sm">
            <li>• Nous collectons uniquement les données nécessaires au service</li>
            <li>• Vos données sont chiffrées et stockées en Europe (RGPD)</li>
            <li>• Nous ne vendons JAMAIS vos données à des tiers</li>
            <li>• Vous pouvez supprimer votre compte et vos données à tout moment</li>
          </ul>
        </div>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">1. Données collectées</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-2">Données que vous nous fournissez</h3>
                <ul className="list-disc list-inside space-y-1 text-white/60">
                  <li>Informations de compte (email, nom, photo de profil)</li>
                  <li>Données de paiement (traitées par Stripe, nous ne stockons pas vos numéros de carte)</li>
                  <li>Contenu que vous créez (projets, fichiers, préférences)</li>
                  <li>Communications avec notre support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Données collectées automatiquement</h3>
                <ul className="list-disc list-inside space-y-1 text-white/60">
                  <li>Adresse IP (anonymisée après 30 jours)</li>
                  <li>Type d'appareil et navigateur</li>
                  <li>Pages visitées et actions effectuées</li>
                  <li>Données de performance et d'erreurs</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Section 2 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">2. Utilisation des données</h2>
            </div>
            <p className="mb-3">Nous utilisons vos données exclusivement pour :</p>
            <ul className="space-y-2">
              {[
                "Fournir, maintenir et améliorer nos services",
                "Traiter vos paiements et gérer votre abonnement",
                "Vous envoyer des notifications importantes (sécurité, mises à jour)",
                "Vous contacter si vous avez besoin d'assistance",
                "Analyser l'utilisation pour améliorer l'expérience (données anonymisées)",
                "Prévenir la fraude et assurer la sécurité de la plateforme",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#D4FF00]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">3. Partage des données</h2>
            </div>
            <p className="mb-4 font-medium text-white">Nous ne vendons JAMAIS vos données. Nous les partageons uniquement avec :</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#D4FF00] rounded-full mt-2" />
                <div>
                  <strong className="text-white">Sous-traitants essentiels</strong>
                  <p className="text-sm">Clerk (auth), Supabase (base de données), Stripe (paiements), Cloudflare (hébergement)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#D4FF00] rounded-full mt-2" />
                <div>
                  <strong className="text-white">Obligations légales</strong>
                  <p className="text-sm">En cas de demande judiciaire ou pour protéger nos droits</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4 - Vos droits */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">4. Vos droits (RGPD)</h2>
            </div>
            <p className="mb-4">En tant qu'utilisateur, vous avez le droit de :</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: Eye, title: "Accès", desc: "Demander une copie de vos données" },
                { icon: Lock, title: "Rectification", desc: "Corriger vos informations" },
                { icon: Trash2, title: "Suppression", desc: "Demander l'effacement de vos données" },
                { icon: Download, title: "Portabilité", desc: "Exporter vos données en format standard" },
                { icon: Bell, title: "Opposition", desc: "Refuser certains traitements" },
                { icon: Shield, title: "Limitation", desc: "Restreindre l'utilisation de vos données" },
              ].map((right, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <right.icon className="w-4 h-4 text-[#D4FF00] mt-0.5" />
                  <div>
                    <div className="font-medium text-white text-sm">{right.title}</div>
                    <div className="text-xs text-white/50">{right.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Pour exercer ces droits : <a href="mailto:privacy@aurion.studio" className="text-[#D4FF00] hover:underline">privacy@aurion.studio</a>
              <br />
              <span className="text-white/50">Délai de réponse : 30 jours maximum</span>
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">5. Sécurité des données</h2>
            </div>
            <ul className="space-y-2">
              {[
                "Chiffrement AES-256 pour les données au repos",
                "TLS 1.3 pour toutes les transmissions",
                "Authentification multi-facteurs disponible",
                "Audits de sécurité réguliers",
                "Hébergement en Europe (Dublin, Irlande)",
                "Sauvegardes quotidiennes chiffrées",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#D4FF00]">🔐</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-[#D4FF00]/10 border border-[#D4FF00]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-[#D4FF00]" />
              <h2 className="text-xl font-semibold text-white">Contact & DPO</h2>
            </div>
            <p className="mb-3">Pour toute question relative à vos données personnelles :</p>
            <div className="space-y-2">
              <p>📧 Email : <a href="mailto:dpo@aurion.studio" className="text-[#D4FF00] hover:underline">dpo@aurion.studio</a></p>
              <p>📍 Adresse : Aurion Studio - DPO, 123 Avenue des Champs-Élysées, 75008 Paris</p>
            </div>
            <p className="text-sm text-white/50 mt-4">
              Vous pouvez également déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#D4FF00] hover:underline">www.cnil.fr</a>
            </p>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-white/40 pt-8 border-t border-white/10">
            <p>
              <Link to="/terms" className="hover:text-white">CGU</Link>
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

export default Privacy;
