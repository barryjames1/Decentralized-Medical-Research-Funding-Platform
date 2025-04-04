;; researcher-verification.clar
;; This contract validates the credentials of scientists

(define-data-var admin principal tx-sender)

;; Researcher status: 0 = unverified, 1 = verified, 2 = revoked
(define-map researchers
  { researcher-id: principal }
  {
    status: uint,
    name: (string-utf8 100),
    credentials: (string-utf8 500),
    institution: (string-utf8 100),
    specialization: (string-utf8 100),
    verification-date: uint
  }
)

;; Add a new researcher (admin only)
(define-public (register-researcher
    (researcher principal)
    (name (string-utf8 100))
    (credentials (string-utf8 500))
    (institution (string-utf8 100))
    (specialization (string-utf8 100)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? researchers { researcher-id: researcher })) (err u100))
    (ok (map-set researchers
      { researcher-id: researcher }
      {
        status: u0,
        name: name,
        credentials: credentials,
        institution: institution,
        specialization: specialization,
        verification-date: u0
      }
    ))
  )
)

;; Verify a researcher (admin only)
(define-public (verify-researcher (researcher principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (match (map-get? researchers { researcher-id: researcher })
      researcher-data (ok (map-set researchers
                          { researcher-id: researcher }
                          (merge researcher-data {
                            status: u1,
                            verification-date: block-height
                          })
                        ))
      (err u404)
    )
  )
)

;; Revoke verification (admin only)
(define-public (revoke-verification (researcher principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (match (map-get? researchers { researcher-id: researcher })
      researcher-data (ok (map-set researchers
                          { researcher-id: researcher }
                          (merge researcher-data { status: u2 })
                        ))
      (err u404)
    )
  )
)

;; Check if a researcher is verified
(define-read-only (is-verified (researcher principal))
  (match (map-get? researchers { researcher-id: researcher })
    researcher-data (is-eq (get status researcher-data) u1)
    false
  )
)

;; Get researcher details
(define-read-only (get-researcher-details (researcher principal))
  (map-get? researchers { researcher-id: researcher })
)

;; Transfer admin rights (admin only)
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)
