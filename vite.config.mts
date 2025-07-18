import {babel} from '@rollup/plugin-babel'
// import react from '@vitejs/plugin-react'
import react from '@vitejs/plugin-react-swc'
// swc 가 빠르지만 17버전 이상부터 사용가능
import browserslistToEsbuild from 'browserslist-to-esbuild'
import preserveDirectives from 'rollup-preserve-directives'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json'

const SUPPORT_TARGETS = browserslistToEsbuild() //browserlist를 읽어서 esbuild.target이 이해할 수 있는 문법으로 고쳐주는 역할을 한다.

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(), //타입스크립트의 경로 별칭 구문 이해하게하는 방법
        preserveDirectives(), //클라이언트컴포넌트 선언하는 지시자인 'use client'를 빌드결과물까지 유지하기 위한 플러그인
        babel({
            babelHelpers: 'runtime', //라이브러리 만들때 사용 하는 값 아니면 bundled
            plugins: [
                ['@babel/plugin-transform-runtime'], //위 설정시 필수 특징1.헬퍼함수 삽입 2.core-js사용
                [
                    'babel-plugin-polyfill-corejs3', //빌드 대상이되는 코드 타깃을 기준으로 폴리필을 넣기 위해 사용
                    {
                        method: 'usage-pure',
                        version: pkg.dependencies['core-js-pure'],
                        proposals: true, //실험적기능
                        shouldInjectPolyfill: (polyfillName: string) => {
                            if (polyfillName === 'esnext.json.parse' || polyfillName === 'es.string.trim') {
                                return false
                            }
                            return true
                        }, //폴리필이 추가되지않기를 바라는 거는 추가안되도록 설정
                    },
                ],
            ],
            extensions: ['.js', '.jsx', '.ts', '.tsx'], // 플러그인 동작해야하는 파일
            exclude: 'node_modules/**',
        }),
    ],
    build: {
        outDir: 'dist',
        lib: {
            entry: {
                //시작점
                index: './src/index.ts',
                react: './src/react.tsx',
                next: './src/next.tsx',
                utils: './src/utils/index.ts',
            },
            formats: ['es', 'cjs'], //두가지 포맷 모두 지원
        },
        rollupOptions: {
            external: [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)].flatMap((dep) => [
                dep,
                new RegExp(`^${dep}/.*`),
            ]), // peerDependencies, dependencies에 있는 거 그것들 subpath(ex next/image)들은 전부 빌드에서 제외하라
            output: [
                //빌드 결과물을 es와 cjs 폴더 분리
                {
                    format: 'es',
                    dir: 'dist/esm',
                },
                {
                    format: 'cjs',
                    dir: 'dist/cjs',
                },
            ],
        },
        target: SUPPORT_TARGETS,
        sourcemap: true,
    },
})
