import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Mail, Shield, User, UserX } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Pending';
}

const mockMembers: TeamMember[] = [
  { id: '1', email: 'alex@example.com', role: 'Owner', status: 'Active' },
  { id: '2', email: 'jordan@example.com', role: 'Admin', status: 'Active' },
  { id: '3', email: 'taylor@example.com', role: 'Member', status: 'Pending' },
];

export const TeamsPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Member'>('Member');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    // Simulate API call
    setTimeout(() => {
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        email: inviteEmail,
        role: inviteRole,
        status: 'Pending',
      };
      setMembers([...members, newMember]);
      setInviteEmail('');
      setIsInviting(false);
    }, 800);
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Team Management</h1>
        <p className="text-gray-400">Collaborate with your team members in this workspace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People with access to this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[var(--color-border)]">
                {members.map((member) => (
                  <div key={member.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center border border-[var(--color-border)] text-[var(--color-primary)]">
                        {member.role === 'Owner' || member.role === 'Admin' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{member.role}</span>
                          {member.status === 'Pending' && (
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-[4px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-gray-500 hover:text-[var(--color-error)] transition-colors p-2"
                        title="Remove member"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invite Member</CardTitle>
              <CardDescription>Add someone new to the team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email address</label>
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full h-10 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:box-glow transition-all"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" isLoading={isInviting}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

