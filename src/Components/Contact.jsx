import ContactForm from "./ContactForm"

function ContactPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-2 lg:py-4 mx-auto">
      <div className="grid lg:gap-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#0066CC]">Get in touch</h1>
          <p className="text-gray-500">
            Have questions about Carbon Tracker? Fill out the form and our team will get back to you as soon as
            possible.
          </p>
          <div className="space-y-2 pt-4">
            <h3 className="font-semibold">Carbon Tracker</h3>
            <p className="text-sm text-gray-500">Making carbon footprint tracking accessible and actionable.</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  )
}

export default ContactPage

