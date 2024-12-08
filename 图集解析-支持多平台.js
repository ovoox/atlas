import common from '../../lib/common/common.js';
import fetch from "node-fetch";
//QQ群：861646887
//GitHub：https://github.com/ovoox
//更多JS插件请访问GitHub
export class ImageGalleryParser extends plugin {
    constructor() {
        super({
            name: "图集解析",
            description: "解析图片链接并返回图片",
            event: "message",
            priority: 0,
            rule: [
                {
                    reg: /^(#|\/)?图集解析.*$/,
                    fnc: "parseImages",
                },
            ],
        });
    }

    async parseImages(e) {
        const urlRegex = /https?:\/\/\S+/g;
        const allText = e.msg;
        const matches = allText.match(urlRegex);
        if (matches && matches.length > 0) {
            for (const matchedUrl of matches) {
                const galleryUrl = `http://www.hhlqilongzhu.cn/api/sp_jx/tuji.php?url=${encodeURIComponent(matchedUrl)}`;

                try {
                    const response = await fetch(galleryUrl);
                    const data = await response.json();

                    if (!data || !data.data) {
                        await e.reply("图集解析失败 请检查链接是否正确");
                        return;
                    }
                    if (data.code === 200 && data.data && data.data.images) {
                        const images = data.data.images;
                        const imageReplies = images.map(image => segment.image(image));
                        await e.reply(imageReplies);
                    } else {
                        await e.reply("解析错误惹 请检查API接口是否有响应");
                    }
                } catch (error) {
                    await e.reply("解析中断 请重试");
                }
            }
        } else {
            await e.reply("没有检测到链接哦");
        }
    }
}
