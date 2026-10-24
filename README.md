# BilaScan B1 — Solana Explorer mô phỏng bằng BilaScript

Trang HTML miễn phí, giao diện tiếng Việt, mô phỏng explorer kiểu Solscan/Etherscan nhưng dùng cách trình bày BilaScript/CVNSS4.0.

## Chạy nhanh

Mở [index.html](index.html) trực tiếp trên trình duyệt hoặc xuất bản qua GitHub Pages (Settings → Pages → Deploy from a branch → main / root).


## Cloudflare Pages (recommended for alternate hostname)

Use [Cloudflare deployment instructions](CLOUDFLARE_PAGES.md) for the precise project setup. Connect GitHub repository **xulytiengviet/BilaScan**, choose **main**, build command **node scripts/build-pages.mjs**, and output directory **dist**. Cloudflare assigns the final `*.pages.dev` hostname once the project is created. The build publishes only essential read-only simulation assets and restrictive security headers.

## Dữ liệu mẫu

- **100 giao dịch giả lập xác định** được sinh theo công thức seed cố định trong JavaScript. Reload vẫn cho cùng lịch sử; nút **Xuất JSON** tải cả 100 giao dịch cùng 16 ví và 4 chương trình.
- **16 ví**: tên, địa chỉ base58 minh họa, số dư lamports, số dư token và lịch sử giao dịch theo ví.
- **4 chương trình mô phỏng**: `BilaVault`, `BilaToken`, `BilaVote`, `BilaRegistry`; có hàm, biến trạng thái, IDL giả và dãy byte mẫu.
- Thông tin chi tiết gồm chữ ký, slot, chương trình, phí, số dư trước/sau, trạng thái, instruction payload hex và các byte số nguyên, log và compute units **giả lập**.
- **Mock API** minh họa các cấu trúc như `getBalance`, `getAccountInfo`, `getTransaction`, `getProgramAccounts` mà **không gọi RPC thật**.

## Quy tắc B1

`BilaScript → Lexer/token substitution (φ) → Solidity → [Solang ngoài trình duyệt] → Solana SBF`.

Ứng dụng này **chỉ triển khai phép thay thế token từ khóa** và kiểm tra round-trip từ vựng tối thiểu. Nó không có parser AST Solidity đầy đủ và không chạy Solang. Các mức AST equality, SBF bytecode identity, IDL identity, discriminator identity, fuzzing và compute-unit identity được ghi **chưa chạy**.

Từ khóa được đổi 1–1; bình luận, chuỗi ký tự và identifier thông thường không đổi. Các cấu trúc `msg.sender`, `delegatecall`, `staticcall`, `immutable`, `assembly` và alias `số_nguyên_không_dấu` bị từ chối bởi bộ lọc demo. **Bộ lọc này không đủ để xác nhận mã tương thích Solang production**.

## CVNSS4.0

Nút CVNSS4.0 dùng codec đã được đưa vào repository ở `vendor/cvnss4.min.js`, không nạp JavaScript từ CDN khi chạy. Vì CVNSS4.0 là ánh xạ nhiều-một, nó **chỉ dùng để hiển thị**, không phải đầu vào của bộ chuyển B1 song ánh. Nếu thiếu hoặc lỗi tệp nội bộ, giao diện báo trạng thái, không tự đoán chữ chuyển đổi.

## Giới hạn an toàn và bản kiểm tra 23/10/2026

- Ứng dụng là **demo read-only/offline**: không có đăng nhập, không hỏi mật khẩu, seed phrase, private key hoặc kết nối ví; không gọi RPC ngoài.
- Trang chỉ nạp hai script nội bộ: `assets/app.js` và `vendor/cvnss4.min.js`; Content Security Policy giới hạn JavaScript vào cùng origin và cấm `connect-src`.
- Nút **Xuất JSON** và **Tải Solidity .sol** chỉ thực hiện khi người dùng chủ động bấm; dữ liệu được tạo ngay trong trình duyệt, không tải phần mềm thực thi từ máy chủ.
- Chạy `node scripts/security-audit.mjs` để kiểm tra tĩnh và xem [GitHub Actions](../../actions) để xác nhận kết quả CI. Đây **không phải** kiểm toán bảo mật toàn diện hoặc chứng nhận của Google.
- Khi một Google Search Console property báo `Deceptive pages` nhưng `Sample URLs: N/A`, không thể quy kết một repository chỉ dựa vào tên miền chung. Cần đối chiếu trạng thái triển khai và tiếp tục rà soát các project sites liên quan.

## Cảnh báo kỹ thuật

- **SIMULATION ONLY**. Không dữ liệu nào chứng minh có giao dịch tồn tại trên Solana.
- Byte ở mục instruction là **payload instruction**, không phải opcode EVM hoặc mã máy SBF.
- Binary minh họa và IDL mẫu **không phải đầu ra biên dịch Solang**, không được phép triển khai.
- Bộ chuyển B1 chưa có bảo đảm *bytecode identity*. Muốn xác nhận B1 cần pin phiên bản Solang/LLVM và build hai nhánh nguồn trong cùng môi trường, so binary và IDL theo chuẩn đã xác định.
- Solang là trình biên dịch Solidity, **không phải RPC** và không phải nguồn gốc dữ liệu on-chain.
- Giao diện demo không thu thập seed phrase, private key và không ký giao dịch.

## Tài liệu tham khảo

- [Solang target Solana](https://solang.readthedocs.io/en/latest/targets/solana.html)
- [Solang language caveats](https://solang.readthedocs.io/en/latest/language/introduction.html)
- [CVNSS4.0 codec](https://github.com/Vietflexmap/CVNSS4)

© BilaScan · Tài liệu demo.
