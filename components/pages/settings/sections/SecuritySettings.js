"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SecuritySettings() {
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [alerts, setAlerts] = useState(true);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Two-Factor Authentication (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Enable extra security during login
          </span>
          <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
        </CardContent>
      </Card>

      {/* Login Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Receive alerts for unrecognized logins
          </span>
          <Switch checked={alerts} onCheckedChange={setAlerts} />
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">Chrome · Dhaka · Active now</p>
          <p className="text-sm">Firefox · New York · Last active 2h ago</p>
          <Button variant="outline">Sign out from all sessions</Button>
        </CardContent>
      </Card>

      {/* Trusted Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Trusted Devices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">MacBook Pro · Added Jan 12, 2025</p>
          <p className="text-sm">iPhone 14 · Added May 3, 2025</p>
          <Button variant="outline">Manage Devices</Button>
        </CardContent>
      </Card>
    </div>
  );
}
