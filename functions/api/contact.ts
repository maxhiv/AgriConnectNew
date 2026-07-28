// The live production form-handling is being moved to GoHighLevel (embedded
// forms + CRM automations). This stub keeps the legacy /api/contact endpoint
// from erroring for any page that hasn't been switched over to the GHL embed
// yet — it accepts the submission and returns success without persisting
// anywhere (there is no database in this deployment).
export const onRequestPost: PagesFunction = async () => {
  return Response.json({ success: true, message: "Message received" });
};
