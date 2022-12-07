import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Verification } from 'src/entity/verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
  ) {}

  async resendEmail(user: User): Promise<boolean> {
    try {
      const verification = await this.verification.findOne({
        where: { user: { id: user.id } },
      });
      if (!verification) {
        return false;
      }
      return this.sendEmail(user.email, verification.code);
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async sendEmail(email: string, code: string): Promise<boolean> {
    try {
      const html = `
      <!doctype html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
        <title>
        </title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a {
            padding: 0;
          }
      
          body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%;
          }
      
          table,
          td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }
      
          img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
          }
      
          p {
            display: block;
            margin: 13px 0;
          }
        </style>
        <!--[if mso]>
              <noscript>
              <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
              </xml>
              </noscript>
              <![endif]-->
        <!--[if lte mso 11]>
              <style type="text/css">
                .mj-outlook-group-fix { width:100% !important; }
              </style>
              <![endif]-->
        <!--[if !mso]><!-->
        <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css);
        </style>
        <!--<![endif]-->
        <style type="text/css">
          @media only screen and (min-width:480px) {
            .mj-column-per-100 {
              width: 100% !important;
              max-width: 100%;
            }
          }
        </style>
        <style media="screen and (min-width:480px)">
          .moz-text-html .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        </style>
        <style type="text/css">
        </style>
        <style type="text/css">
          * {
            word-break: keep-all;
          }
      
          a {
            color: #2563eb !important;
          }
        </style>
      </head>
      
      <body style="word-spacing:normal;">
        <div style="">
          <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
              <tbody>
                <tr>
                  <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tbody>
                          <!-- Header -->
                          <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:Pretendard, Arial;font-size:32px;line-height:1.5;text-align:left;color:#404040;">Exam World! 계정 인증</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="font-size:0px;word-break:break-word;">
                              <div style="height:0px;line-height:0px;">&#8202;</div>
                            </td>
                          </tr>
                          <!-- Main -->
                          <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:Pretendard, Arial;font-size:16px;line-height:1;text-align:left;color:#404040;">안녕하세요 가입해주셔서 감사합니다.</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:Pretendard, Arial;font-size:16px;line-height:1;text-align:left;color:#404040;">본인 인증을 위해 아래 "계정 확인" 버튼을 클릭해 주세요</div>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                <tr>
                                  <td align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle">
                                    <a href="https://exam-world.prod.kro.kr/verify/email?code=${code}" style="display:inline-block;background:#414141;color:white;font-family:Pretendard, Arial;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"> 계정 확인 </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- Footer -->
                          <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <p style="border-top:solid 1px #E5E7EB;font-size:1px;margin:0px auto;width:100%;">
                              </p>
                              <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #E5E7EB;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
      </td></tr></table><![endif]-->
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                              <div style="font-family:Pretendard, Arial;font-size:12px;line-height:1.75;text-align:left;color:#404040;"><a href="https://exam-world.prod.kro.kr" target="_blank" rel="noopener noreferrer nofollow">웹사이트 바로가기</a></div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--[if mso | IE]></td></tr></table><![endif]-->
        </div>
      </body>
      
      </html>
      `;

      // 메일 발송 기능
      await this.mailerService.sendMail({
        // 발신자 이름 + 발신자 메일
        from: `"Exam world!" <${process.env.GMAIL_SMTP_NAME}>`,
        // 착신자 메일
        to: email,
        // 이메일 제목
        subject: 'Exam world! 본인 인증',
        // 이메일 본문
        html,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
