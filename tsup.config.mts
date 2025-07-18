// tsup - esbuild를 기반으로 만들어진 패키지 ts기반 작성 패키지 손쉽게 번들링 (타입 파일을 만드는 기능)
import {defineConfig} from 'tsup'

import type {Format, Options} from 'tsup'

const entries: Options['entry'] = {
    index: './src/index.ts',
    react: './src/react.tsx',
    next: './src/next.tsx',
    utils: './src/utils/index.ts',
    types: './src/types/index.ts', //vite와 다르게 더 깔끔한 타입 선언을 위해 추가
} as const

const sharedConfig: Options = {
    //공통으로 사용할 수 있는 구성 파일을 별도로 객체 선언
    entry: entries,
    dts: {only: true}, //.d.ts파일 만들기 위함 (결과물은 생성 X 타입파일만 생성)
} as const

const createConfig = (
    format: Exclude<Format, 'iife'>, // esm과 cjs 두가지 포맷을 받아서 sharedConfig와 함께 defineConfig에 넘겨주는 함수
) =>
    defineConfig({
        ...sharedConfig,
        format: [format],
        outDir: `./dist/${format}`, // 각 버전으로 번들링된 결과물을 각 ./dist/esm ./dist/cjs에 저장
    })

export default [createConfig('esm'), createConfig('cjs')]
