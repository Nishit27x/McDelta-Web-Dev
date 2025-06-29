import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, ShieldCheck } from 'lucide-react';

const deltanRules = [
  {
    title: "δ1. Eligibility for Participation",
    points: [
      "1.1. All individuals must hold the designation of Deltan to qualify for benefits under this policy.",
      "1.2. Only active members, defined as those who demonstrate consistent and meaningful participation within the SMP, shall be considered valid referrals."
    ]
  },
  {
    title: "δ2. Invitation Procedure",
    points: [
      "2.1. Deltans may extend invitations to potential new members, subject to the standards and expectations upheld by the McDelta SMP.",
      "2.2. Each invitation must be formally registered with the server administration for verification and record-keeping."
    ]
  },
  {
    title: "δ3. Token of Appreciation – Award Structure",
    points: [
        "3.1. Tokens shall serve as symbolic, tradeable acknowledgments of a Deltan’s contribution to the server’s growth.",
        "3.2. The distribution of tokens shall occur as follows:",
    ],
    subpoints: [
        "a) One (1) token upon the successful invitation of three (3) active members.",
        "b) A second (2) token upon reaching a total of five (5) active invitees.",
        "c) A third (3) token upon reaching ten (10) active invitees.",
        "d) Thereafter, one (1) additional token shall be granted for each subsequent active member invited beyond the tenth."
    ]
  },
  {
    title: "δ4. Verification and Distribution",
    points: [
      "4.1. The McDelta Administration shall conduct regular audits to verify the activity status of referred members.",
      "4.2. Tokens will be issued only upon successful verification and may be exchanged, transferred, or substituted under any circumstance."
    ]
  },
  {
    title: "δ5. General Provisions",
    points: [
      "5.1. The Administration retains full authority to amend, suspend, or revoke eligibility in instances involving misconduct, false referrals, or inactivity.",
      "5.2. These provisions are subject to periodic review and adjustment, ensuring alignment with the evolving interests of the McDelta SMP community."
    ]
  },
    {
    title: "δ6. Block Request Entitlement Policy",
    points: [
      "6.1. Deltans may formally request specific types and quantities of blocks from the McDelta SMP Administration, provided such materials are intended for use in a declared build project.",
      "6.2. Each request must be accompanied by a clear and reasonable description of the intended build, including location, scale, and purpose.",
      "6.3. Requests may be approved or denied at the sole discretion of the Administration, based on feasibility, fairness, and server balance."
    ]
  },
  {
    title: "δ7. Build Obligation and Accountability",
    points: [
      "7.1. Upon approval of a request, the Deltan enters a binding obligation to complete the declared build within a reasonable timeframe, as mutually agreed upon.",
      "7.2. Progress may be periodically reviewed by the Administration to ensure compliance.",
      "7.3. Failure to complete the stated build within the agreed time or willful misuse of the provided blocks shall constitute a breach of trust."
    ]
  },
  {
    title: "δ8. Penalties for Non-Compliance",
    points: [
      "8.1. In the event of non-completion or misuse of requested blocks, the following penalties may be enforced:"
    ],
    subpoints: [
      "a) A fine payable in rare in-game items or currency, as determined by the Administration.",
      "b) Temporary suspension from further block requests.",
      "c) Revocation of previously granted blocks or privileges, including possible rollback of placed blocks."
    ],
    points2: [
        "8.2. Repeated or severe violations may result in disciplinary action, including but not limited to removal from special programs or administrative review."
    ]
  },
    {
    title: "δ9. Transparency and Review",
    points: [
      "9.1. All approved requests shall be recorded and publicly viewable (e.g., via Discord or an in-game ledger) to maintain transparency.",
      "9.2. Appeals or requests for deadline extensions must be submitted in writing to the Administration before the original deadline lapses."
    ]
  },
];

const adminRules = [
    {
        title: "δ1. Role of Admins",
        points: ["Admins serve as custodians of the McDelta SMP. Their role is to enforce rules, maintain fairness, and support the server’s smooth functioning without bias or abuse."]
    },
    {
        title: "δ2. Responsibilities",
        points: [
            "2.1. Enforce SMP rules and manage compliance.",
            "2.2. Process and verify block requests, invitations, and build commitments.",
            "2.3. Maintain accurate records of requests, penalties, and invitations.",
            "2.4. Assist players with clarity, fairness, and respect."
        ]
    },
    {
        title: "δ3. Use of Admin Privileges",
        points: [
            "3.1. Admin commands and creative mode may only be used for administrative purposes.",
            "3.2. Privileges must not be used for personal gain (e.g., PvP, trading, or resource farming).",
            "3.3. All admin actions must be accountable and justifiable."
        ]
    },
    {
        title: "δ4. Conduct and Ethics",
        points: [
            "4.1. Admins must remain neutral in disputes and avoid favoritism.",
            "4.2. Communication with players must be clear, respectful, and consistent.",
            "4.3. Admins must act as role models within the community."
        ]
    },
    {
        title: "δ5. Decision-Making Protocol",
        points: [
            "5.1. Major actions (e.g., bans, large block grants, penalties) require agreement between at least two admins.",
            "5.2. All decisions must be recorded in a shared admin log or channel.",
            "5.3. In emergencies, a single admin may act but must report the action promptly."
        ]
    },
    {
        title: "δ6. Accountability and Limitations",
        points: [
            "6.1. Admins are subject to all server rules unless exempted by formal policy.",
            "6.2. Abuse of powers will lead to investigation and potential removal.",
            "6.3. Collective decisions made carelessly may lead to shared responsibility."
        ]
    }
];

export default function RulesPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="font-jokerman text-7xl md:text-8xl text-primary drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
            McDelta SMP
          </h1>
          <h2 className="font-headline text-4xl md:text-5xl text-muted-foreground tracking-widest uppercase mt-2">
            Rules
          </h2>
          <p className="text-lg text-muted-foreground mt-8 max-w-3xl mx-auto">
            To foster community growth and reward initiative, these guidelines govern our server. Please read them carefully.
          </p>
        </div>

        <Card className="mb-8 bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Preamble</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground leading-relaxed">
              To foster community growth and reward initiative within the McDelta SMP, the following formal guidelines shall govern the process of inviting new members and the distribution of tokens as marks of appreciation.
            </p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={['deltan-guidelines', 'admin-guidelines']} className="w-full space-y-8">
          <AccordionItem value="deltan-guidelines" className="border-b-0">
             <Card>
                <AccordionTrigger className="text-2xl md:text-3xl font-bold px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4">
                    <BookOpenCheck className="w-8 h-8 text-primary" />
                    <span>ARTICLE-A: Deltan Guidelines</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-6">
                    {deltanRules.map((rule, index) => (
                      <div key={index}>
                        <h4 className="font-bold text-lg mb-2 text-primary">{rule.title}</h4>
                        <ul className="list-none space-y-2 pl-4 text-muted-foreground">
                          {rule.points.map((point, pIndex) => (
                            <li key={pIndex}>{point}</li>
                          ))}
                          {rule.subpoints && (
                            <ul className="list-none space-y-1 pl-8 pt-1">
                                {rule.subpoints.map((subpoint, sIndex) => (
                                    <li key={sIndex}>{subpoint}</li>
                                ))}
                            </ul>
                          )}
                           {rule.points2 && (
                            <ul className="list-none space-y-2 pt-2">
                                {rule.points2.map((point2, p2Index) => (
                                    <li key={p2Index}>{point2}</li>
                                ))}
                            </ul>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="admin-guidelines" className="border-b-0">
            <Card>
                <AccordionTrigger className="text-2xl md:text-3xl font-bold px-6 py-4 hover:no-underline">
                 <div className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-destructive" />
                    <span>ARTICLE-B: Admin Guidelines</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                     <div className="space-y-6">
                        {adminRules.map((rule, index) => (
                            <div key={index}>
                                <h4 className="font-bold text-lg mb-2 text-primary">{rule.title}</h4>
                                <ul className="list-none space-y-2 pl-4 text-muted-foreground">
                                    {rule.points.map((point, pIndex) => (
                                        <li key={pIndex}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

         <div className="mt-12 text-center text-muted-foreground text-sm">
            <p className="font-bold">Enacted by Authority of: The McDelta SMP Administration</p>
            <p>Date: 27 June 2025</p>
        </div>

      </main>
      <Footer />
    </div>
  );
}
