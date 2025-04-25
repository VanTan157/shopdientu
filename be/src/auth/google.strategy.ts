import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

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

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    try {
      if (!profile.emails || !profile.emails[0]?.value) {
        return done(new Error("Email not provided by Google"), false);
      }

      const { id, displayName, emails } = profile;
      const user = {
        googleId: id,
        email: emails[0].value,
        name: displayName || "Unknown",
      };
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
}
