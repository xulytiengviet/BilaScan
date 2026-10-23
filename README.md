# BilaScan B1 — Solana Explorer mô phỏng bằng BilaScript

Trang HTML miễn phí, giao diện tiếng Việt, mô phỏng explorer kiểu Solscan/Etherscan nhưng dùng cách trình bày BilaScript/CVNSS4.0.

## Chạy nhanh

Mở [index.html](index.html) trực tiếp trên trình duyệt hoặc xuất bản qua GitHub Pages (Settings → Pages → Deploy from a branch → main / root).

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

Nút CVNSS4.0 dùng codec `Vietflexmap/CVNSS4@v1.0.1` qua jsDelivr khi có mạng. Vì CVNSS4.0 là ánh xạ nhiều-một, nó **chỉ dùng để hiển thị**, không phải đầu vào của bộ chuyển B1 song ánh. Nếu CDN không có, giao diện báo trạng thái, không tự đoán chữ chuyển đổi.

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
