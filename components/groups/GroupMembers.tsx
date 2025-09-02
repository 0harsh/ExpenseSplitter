import { GroupMember } from './types';

interface GroupMembersProps {
  members: GroupMember[];
  creatorId: string;
}

export default function GroupMembers({ members, creatorId }: GroupMembersProps) {
  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-sm">
                  {(member.user.name || member.user.username).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {member.user.name || member.user.username}
                </p>
                {member.userId === creatorId && (
                  <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    Creator
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
