import React from "react";

const Receipt = () => {
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: "350px" }}>
      <div className="w-full" style={{ height: "50px", background: "#1f8fe5" }} />
      <div
        className="w-full flex relative justify-center items-center pb-2"
        style={{ height: "460px", background: "#dee7ee" }}
      >
        {/* Ticket */}
        <div className="flex justify-center absolute bg-white -top-5 w-4/5 py-5">
          <div className="absolute -top-1 flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="h-2.5 w-2.5 rounded-full" style={{ background: "#1f8fe5" }} />
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full px-3">
            <div className="flex flex-col items-center">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEipDaD-39vGN38RrBmUjfY5jz9yDK2SdbcuFd20a4b0t1Vkb97hlXQFHE1Tic8ys4Kwa0eghASHcp7OjgcGibXZ5qiiY6_gSKs8RwGkxymcUmdzQtdZ2eKe2SswYtrEPBSM9DQjD3_eeB84ZE_b2WiTTbZGkTIGT516Rdie-i2tP7Jm8RsGcadsPQ/w380/Logo%20DANA%20-%20%20(Koleksilogo.com).png"
                alt="pg-img"
                className="h-10 w-20 object-contain"
              />
              <p className="font-bold text-sm">Transaksi Berhasil</p>
            </div>

            <div className="flex flex-col gap-1 pb-3 px-1 border-b-2 border-dashed" style={{ borderColor: "#dee7ee" }}>
              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Tanggal</p>
                <p style={{ fontSize: "10px" }}>2021-01-16 08:34:48 WIB</p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Nomor Referensi</p>
                <p style={{ fontSize: "10px" }}>202408579896</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-3 px-1 border-b-2 border-dashed" style={{ borderColor: "#dee7ee" }}>
              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Sumber Dana</p>
                <div>
                  <p className="font-bold" style={{ fontSize: "10px" }}>
                    CEPTARINA PELAWI
                  </p>
                  <p className="font-bold text-right" style={{ fontSize: "10px" }}>
                    3274 **** **** 537
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Jenis Transaksi</p>
                <p className="font-bold" style={{ fontSize: "10px" }}>
                  Transfer DANA
                </p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Bank Tujuan</p>
                <p className="font-bold" style={{ fontSize: "10px" }}>
                  DANA
                </p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Nomor Tujuan</p>
                <p className="font-bold" style={{ fontSize: "10px" }}>
                  530601034438533
                </p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Nama Tujuan</p>
                <p className="font-bold text-right" style={{ fontSize: "10px" }}>
                  Sprint Asia
                </p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Keterangan</p>
                <p className="font-bold" style={{ fontSize: "10px" }}>
                  Aku
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-3 px-1 border-b-2 border-dashed" style={{ borderColor: "#dee7ee" }}>
              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Nominal</p>
                <p style={{ fontSize: "10px" }}>Rp5.000.000</p>
              </div>

              <div className="flex justify-between">
                <p style={{ fontSize: "10px" }}>Biaya Admin</p>
                <p style={{ fontSize: "10px" }}>Rp0</p>
              </div>
            </div>

            <div className="flex justify-between px-1">
              <p className="font-bold" style={{ fontSize: "10px" }}>
                Total
              </p>
              <p className="font-bold text-primary500">Rp5.000.000</p>
            </div>
          </div>

          <div className="absolute flex justify-between" style={{ width: "110%", bottom: "50px" }}>
            <div className="h-5 w-5 rounded-full" style={{ background: "#dee7ee" }}></div>
            <div className="h-5 w-5 rounded-full" style={{ background: "#dee7ee" }}></div>
          </div>

          <div className="absolute -bottom-1 flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="h-2.5 w-2.5 rounded-full" style={{ background: "#dee7ee" }} />
            ))}
          </div>
        </div>

        <div className="flex-col self-end w-full">
          <p className="text-neutral300 text-center" style={{ fontSize: "10px" }}>
            © 2020 PT.Bank Rakyat Indonesia (persero) Tbk.
          </p>
          <p className="text-neutral300 text-center" style={{ fontSize: "10px" }}>
            Terdaftar dan diawasi oleh Otoritas Jasa Keuangan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
