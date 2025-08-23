import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET");

    if (!clientID || !clientSecret) {
      throw new Error(
        "Google client ID or secret is not defined in the configuration."
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL: "http://localhost:8080/auth/google/callback",
      scope: ["email", "profile"],
      passReqToCallback: true,
    });
  }

  async validate(profile: any): Promise<any> {
    if (!profile.emails || !profile.emails[0]?.value) {
      throw new Error("Email not provided by Google");
    }
    return {
      userId: profile.id,
      email: profile.emails[0].value,
      type: "google",
      name: profile.displayName || "Unknown",
    };
  }
}
