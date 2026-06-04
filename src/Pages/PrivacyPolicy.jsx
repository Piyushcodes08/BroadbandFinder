import React from "react";
import logo from "../assets/logo.png";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white  flex  md:flex-row flex-col items-center  justify-between md:px-32" data-aos="fade-down">
        <div className=" py-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Privacy Policy of 24x7 NetConnect 
          </p>
          <address className="mt-4 not-italic text-gray-700">
            <div className="font-semibold">24x7 NetConnect</div>
            <div>12130 Millennium Drive, Ste 600</div>
            <div>Los Angeles, CA 90094</div>
          </address>
          <p className="mt-4 text-sm text-gray-600">LAST UPDATED 6/18/2025</p>
        </div>
        <div>
          <img src={logo} alt="logo" className="md:w-96" />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        {/* TOC */}
        <nav className="order-last lg:order-first" data-aos="fade-right">
          <div className="sticky top-6 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              On this page
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {[
                "information-collection-and-use",
                "personal-information",
                "sensitive-personal-information",
                "insurance-customers-and-clients",
                "job-applicants",
                "cookies-and-ip-addresses",
                "clear-gifs",
                "telephone-calls-and-recordings",
                "information-selling-sharing-and-targeted-advertising",
                "other-transfers-of-information-to-third-parties",
                "sms-communications",
                "marketing-opt-out",
                "third-party-links",
                "minors",
                "updating-your-information",
                "questions-and-suggestions",
                "retention",
                "changes-to-this-privacy-policy",
                "your-privacy-rights",
              ].map((id) => (
                <li key={id}>
                  <a
                    className="text-blue-600 hover:text-blue-700"
                    href={`#${id}`}
                  >
                    {id
                      .replaceAll("-", " ")
                      .replace(/\b\w/g, (m) => m.toUpperCase())}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Content */}
        <article className="prose prose-gray max-w-none" data-aos="fade-left">
          <p>
            At 24x7 NetConnect we take our ethical responsibilities and your privacy
            seriously by recognizing that your privacy is important. We have a
            strong commitment to providing excellent service to all our
            customers, visitors to this Web Site, and other users of our
            products and services, including respecting your concerns about
            privacy.
          </p>
          <p>
            This Privacy Policy discloses how we collect personal information,
            the types of personal information we receive and collect, our use
            and disclosure of current and former consumer information, as well
            as the steps that we take to safeguard your information.
          </p>
          <p>
            If you use this site, you understand and agree to the 24x7 NetConnect
            Privacy Policy in effect at the time of your use, and any other
            terms and conditions posted on the site. We hope that this
            disclosure will help increase your confidence in our products and
            services, and enhance your experience.
          </p>
          <p>
            Therefore, in compliance with industry standards and regulations
            enforced typically by federal and state governments, we abide by the
            following Privacy Policy.
          </p>

          <h2 id="information-collection-and-use">
            Information Collection and Use
          </h2>
          <p>
            This Privacy Policy applies to all users of our products and
            services (“Consumers”), including those who have used our website
            (“Web Site”), which is owned by Centerfield Media Parent, Inc., a
            Delaware corporation (“Owner”). Please note that this policy applies
            only to this Web Site, and services wherein 24x7 NetConnect determines
            the purposes or means of processing your personal information, and
            not to web sites maintained by other companies or organizations to
            which we link, or business partners to whom we provide your
            information, based on your requests as relating to the product or
            service in which you are interested, and for whom we serve as
            service providers. Alternatively, the information 24x7 NetConnect
            collects on behalf of a third party, to whom we provide marketing
            services, may be subject to both this Privacy Policy, and the third
            party’s privacy policy.
          </p>

          <h3 id="personal-information">Personal Information</h3>
          <p>
            Personal information is information that identifies, relates to,
            describes, is reasonably capable of being associated with, or could
            reasonably be linked, directly or indirectly, with a natural person
            or household, such as a real name, postal address, e-mail address,
            telephone number, payment information, and account ID (“personal
            information”). When other information is directly associated with
            personal information, that information may also be considered
            personal information. Information that is aggregated, de-identified,
            or anonymized is not considered personal information. Publicly
            available information, as that information is defined by applicable
            law, also may not be personal information.
          </p>
          <p>
            We collect, use, share, and/or store the following types of personal
            information, either online or on the phone, and either
            automatically, from you directly, or from third parties (including
            publicly accessible sources, marketing vendors, data aggregation
            businesses, and others), for the business purposes as outlined in
            this Privacy Policy, depending on how you interact with us:
          </p>
          <ul>
            <li>
              Identifiers, such as full name, postal address, shipping address,
              IP address, phone numbers, e-mail address, and customer record
              information.
            </li>
            <li>
              Payment-related information, including bank account or credit card
              information.
            </li>
            <li>
              Audio information, including voice recordings of telephone calls.
            </li>
            <li>
              Communications and other content provided via webforms, chat, and
              other means.
            </li>
            <li>
              Internet or network activity, including information from cookies
              and clear gifs.
            </li>
          </ul>

          <h3 id="sensitive-personal-information">
            Sensitive Personal Information
          </h3>
          <p>
            Some of the personal information we collect may be considered
            “sensitive personal information” under applicable law. When we
            collect or process sensitive personal information, we do so with
            your consent, or as permitted by applicable law. We may sell or
            share your sensitive personal information or use such information
            for targeted advertising purposes, as permitted by law. We may
            disclose your sensitive personal information to our affiliates and
            service providers to facilitate your transactions with us.
          </p>

          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Type of Sensitive Information
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Is this collected?
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    How will it be used?
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    How long do we retain it?
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3">
                    SSN / Driver’s License / State ID / Passport
                  </td>
                  <td className="px-4 py-3">Only when applicable</td>
                  <td className="px-4 py-3">
                    For processing of sales; order eligibility verification
                  </td>
                  <td className="px-4 py-3">Not stored</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    Account log-in and card credentials
                  </td>
                  <td className="px-4 py-3">Only when necessary</td>
                  <td className="px-4 py-3">
                    Identify active users on login-required sites
                  </td>
                  <td className="px-4 py-3">
                    While account is active; deleted upon deletion
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Precise geolocation</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    Race/ethnicity, beliefs, union membership
                  </td>
                  <td className="px-4 py-3">For job applicants (optional)</td>
                  <td className="px-4 py-3">Only for job applicants</td>
                  <td className="px-4 py-3">Up to ten years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Contents of mail, email, text</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Genetic data</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Biometric identifiers</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Health information</td>
                  <td className="px-4 py-3">Only when applicable</td>
                  <td className="px-4 py-3">
                    To facilitate shopping/purchasing relevant products/services
                  </td>
                  <td className="px-4 py-3">Up to ten years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Sex life/sexual orientation</td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Citizenship/immigration status</td>
                  <td className="px-4 py-3">Only when applicable</td>
                  <td className="px-4 py-3">If you apply for a job with us</td>
                  <td className="px-4 py-3">Up to ten years</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    Personal data from a known child
                  </td>
                  <td className="px-4 py-3">No</td>
                  <td className="px-4 py-3">N/A</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6">
            Depending on your state of residence, you may request that use of
            your sensitive personal information be limited by filling out the
            form titled “Limit Use of My Sensitive Personal Information” linked
            at the bottom of this privacy policy or in the footer of this
            webpage, or by contacting us at 844-280-2929. If you are a resident
            of certain states, we do not collect or process your sensitive data
            without your consent.
          </p>

          <h2 id="insurance-customers-and-clients">
            Insurance Customers and Clients
          </h2>
          <p>
            If you are a customer for whom we process an insurance application,
            we will collect additional information in connection with your
            application (e.g., medical record number, Medicare beneficiary
            identifier, health and demographic information for you and
            dependents). We do not sell, share, or use for targeted advertising
            the aforementioned personal information of our insurance customers
            or clients whose information we collect and use solely for
            performing such services. We may, however, sell, share, or use other
            personal information collected through other interactions as
            disclosed in this Privacy Policy.
          </p>

          <h2 id="job-applicants">Job Applicants</h2>
          <p>
            If you apply for a job with Owner, we will collect additional
            information in connection with your application, including contact
            details, authorization status, resume/CV, experience/education,
            skills, licenses, references, and optional demographic information.
            We use this to evaluate your candidacy, process your application,
            correspond with you, and comply with legal obligations.
          </p>

          <h2 id="cookies-and-ip-addresses">Cookies and IP Addresses</h2>
          <p>
            We use cookies and similar technologies to operate and personalize
            the site, analyze performance, and present you with personalized
            offers. You may control cookies via your browser settings; rejecting
            cookies may limit certain features. We also keep track of IP
            addresses and may disclose your IP during the course and scope of
            our business.
          </p>

          <h2 id="clear-gifs">Clear Gifs</h2>
          <p>
            We employ clear gifs (Web Beacons) to better manage site content and
            understand email engagement. To opt-out of marketing emails, use the
            unsubscribe instructions in any email from us.
          </p>

          <h2 id="telephone-calls-and-recordings">
            Telephone Calls and Recordings
          </h2>
          <p>
            You provide prior express written consent to receive marketing calls
            and texts (including via autodialer and prerecorded/artificial
            voices) to any number you provide, even if on a do-not-call
            registry. Consent is not required to purchase goods or services; you
            may use our services without providing this consent by dialing the
            telephone number on our site. Calls may be recorded for quality and
            compliance.
          </p>

          <h2 id="information-selling-sharing-and-targeted-advertising">
            Information Selling, Sharing and Use for Targeted Advertising
          </h2>
          <p>
            We may sell, share, or use your personal information (as defined by
            applicable laws) for targeted advertising. Categories of third
            parties include partners, sponsors, advertisers, service providers,
            and marketing services. In the past 12 months, we have sold or
            shared identifiers and health information (except for insurance
            customers as noted above) and disclosed for business purposes
            identifiers, audio information, communications and other content,
            internet or network activity, and sensitive information.
          </p>

          <h2 id="other-transfers-of-information-to-third-parties">
            Other Transfers of Information to Third Parties
          </h2>
          <p>
            We may transfer information to third parties to: fulfill your
            requests (including allowing partners to contact you by phone, SMS,
            email, or mail); operate portions of our site via vendors; comply
            with law; protect our rights; and in connection with corporate
            transactions. Third parties hired by us must follow this Privacy
            Policy and are prohibited from using your information beyond their
            engagement.
          </p>

          <h2 id="sms-communications">SMS Communications</h2>
          <p>
            By opting in to receive SMS from 24x7 NetConnect, you consent to
            promotional messages, updates, and offers. Message frequency varies;
            standard message/data rates apply. Text <strong>START</strong> to{" "}
            <strong>844-629-6320</strong> to opt in; reply <strong>STOP</strong>{" "}
            to opt out. Consent for SMS is not provided to any third party.
          </p>

          <h2 id="marketing-opt-out">24x7 NetConnect Marketing Opting-Out</h2>
          <p>
            You may opt-out of newsletter and promotional communications by
            following unsubscribe instructions in our emails or by contacting us
            as listed on our contact page. Processing may take up to ten
            business days. For partner/third-party communications, please
            contact those parties directly.
          </p>

          <h2 id="third-party-links">Third Party Links</h2>
          <p>
            This policy applies to information that 24x7 NetConnect collects. When
            you visit linked third-party websites, their privacy and security
            policies govern. Please review their policies and terms.
          </p>

          <h2 id="minors">Minors</h2>
          <p>
            You must be at least 18 years old to use this site. We do not
            knowingly collect personal information from visitors under 18. If
            under 18, you may use the services only with parental consent and
            supervision.
          </p>

          <h2 id="updating-your-information">Updating Your Information</h2>
          <p>
            To access or update personal information you submitted to
            24x7 NetConnect, email{" "}
            <a href="mailto:support@24x7netconnect.us">support@24x7netconnect.us</a>{" "}
            or write to:
          </p>
          <address className="not-italic text-gray-700">
            <div className="font-semibold">24x7 NetConnect</div>
            <div>12130 Millennium Drive, Ste 600</div>
            <div>Los Angeles, CA 90094</div>
          </address>

          <h2 id="questions-and-suggestions">Questions and Suggestions</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at{" "}
            <a href="mailto:support@24x7netconnect.us">support@24x7netconnect.us</a>{" "}
            or call <strong>1-855 744 2407</strong>.
          </p>

          <h2 id="retention">Retention</h2>
          <p>
            We retain personal information only as long as reasonably necessary
            to fulfill the purposes outlined in this policy, comply with legal
            obligations, and resolve disputes.
          </p>

          <h2 id="changes-to-this-privacy-policy">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy periodically. Updates will be
            posted here with a new “Last Updated” date. Significant changes may
            also be communicated via email or other appropriate means.
          </p>

          <h2 id="your-privacy-rights">Your Privacy Rights</h2>
          <p>
            Depending on your state of residence, you may have the right to
            access, correct, delete, or opt out of the sale/sharing of your
            personal information. To exercise your rights, please contact us as
            described above.
          </p>
        </article>
      </div>
    </main>
  );
}
