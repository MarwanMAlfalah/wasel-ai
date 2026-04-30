import { PageHeader } from "@/components/shared/page-header";
import { ConversationComposer } from "@/components/app/conversation-composer";

export default function NewConversationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="أضف محادثة العميل"
        description="الصق المحادثة اللي فيها تفاصيل الاتفاق، وواصل بيستخرج منها بيانات الفاتورة تلقائيًا."
      />
      <ConversationComposer />
    </div>
  );
}
